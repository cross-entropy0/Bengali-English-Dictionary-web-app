// Debug script to find why meanings array is empty
require('dotenv').config();
const mongoose = require('mongoose');
const { Eng, Oten, Other } = require('./models/Dictionary');
const { xorDecrypt } = require('./utils/encryption');
const { getTypeName } = require('./utils/typeMapping');

async function debugLookup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    const testWord = 'COMPUTER';
    console.log(`Testing word: ${testWord}\n`);

    // Step 1: Find in eng table
    const engEntry = await Eng.findOne({ word: testWord });
    if (!engEntry) {
      console.log('❌ Word not found in eng table');
      process.exit(1);
    }
    console.log('✅ Step 1 - Found in eng table:');
    console.log(`   serial: ${engEntry.serial}`);
    console.log(`   word: ${engEntry.word}\n`);

    // Step 2: Get details from other table
    const otherEntry = await Other.findOne({ serial: engEntry.serial });
    if (!otherEntry) {
      console.log('❌ Details not found in other table');
      process.exit(1);
    }
    console.log('✅ Step 2 - Found in other table:');
    console.log(`   word: ${otherEntry.word}`);
    console.log(`   tr: ${otherEntry.tr}`);
    console.log(`   def: ${otherEntry.def?.substring(0, 100)}...`);
    console.log(`   exm: ${otherEntry.exm?.substring(0, 100)}...`);
    console.log(`   ant: ${otherEntry.ant}`);
    console.log(`   ed type: ${typeof otherEntry.ed}`);
    console.log(`   ed is Buffer: ${Buffer.isBuffer(otherEntry.ed)}`);
    console.log(`   ed length: ${otherEntry.ed?.length}\n`);

    // Step 3: Try to decrypt ed field
    if (!otherEntry.ed || otherEntry.ed.length === 0) {
      console.log('❌ ed field is empty or missing');
      process.exit(1);
    }

    console.log('✅ Step 3 - Attempting decryption...');
    const decrypted = xorDecrypt(otherEntry.ed);
    console.log(`   Decrypted length: ${decrypted.length}`);
    console.log(`   First 200 chars: ${decrypted.substring(0, 200)}\n`);

    // Step 4: Parse JSON
    console.log('✅ Step 4 - Parsing JSON...');
    let parsed;
    try {
      parsed = JSON.parse(decrypted);
      console.log(`   Parsed successfully`);
      console.log(`   Type: ${typeof parsed}`);
      console.log(`   Is Array: ${Array.isArray(parsed)}`);
      console.log(`   Length: ${parsed.length}`);
      console.log(`   Full structure:`, JSON.stringify(parsed, null, 2), '\n');
    } catch (e) {
      console.log('❌ JSON parse error:', e.message);
      process.exit(1);
    }

    // Step 5: Process meanings
    console.log('✅ Step 5 - Processing meanings...');
    const meanings = [];
    
    for (const [typeId, ...serials] of parsed) {
      console.log(`   Processing type ${typeId} with ${serials.length} serials`);
      
      const meaningObj = {
        partOfSpeech: getTypeName(typeId),
        typeId: typeId,
        words: []
      };

      // Fetch all Bengali words for these serials
      const bengaliWords = await Oten.find({ serial: { $in: serials } });
      console.log(`   Found ${bengaliWords.length} Bengali words`);

      // Create serial to data map
      const serialToData = {};
      for (const bw of bengaliWords) {
        let relatedEnglish = [];
        if (bw.en && bw.en.length > 0) {
          const decryptedEn = xorDecrypt(bw.en);
          relatedEnglish = JSON.parse(decryptedEn);
        }
        serialToData[bw.serial] = {
          bengali: bw.ot,
          relatedEnglish,
          serial: bw.serial
        };
      }

      // Build words array preserving order
      for (const serial of serials) {
        if (serialToData[serial]) {
          meaningObj.words.push(serialToData[serial]);
        }
      }

      meanings.push(meaningObj);
    }

    console.log(`\n✅ Final result - ${meanings.length} meaning groups:\n`);
    console.log(JSON.stringify(meanings, null, 2));

    await mongoose.disconnect();
    console.log('\n✅ MongoDB disconnected');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

debugLookup();
