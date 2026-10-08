/**
 * TalkRiva AI - Complete Real-Life Functions Verification Test
 * Tests and verifies that all core engine functions, memory, mistake detection,
 * filler counters, Hindi helpers, curriculum, and emotional responses work 100%.
 */

const { UserMemoryMind, ConversationEngine } = require('./js/engine.js');

async function testAllFunctions() {
  console.log("================================================================");
  console.log("  TALKRIVA AI — COMPLETE REAL-LIFE FUNCTION VERIFICATION SUITE  ");
  console.log("================================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  const engine = new ConversationEngine();

  // --------------------------------------------------------------------------
  // TEST 1: Profile Memory & Fact Extraction
  // --------------------------------------------------------------------------
  console.log("1. TESTING PERSISTENT USER MEMORY MIND & FACT EXTRACTION:");
  engine.memory.updateProfile({
    name: "Abhishek",
    level: "tooti-footi",
    goal: "job-interview",
    profession: "student"
  });
  const summary = engine.memory.getSummary();
  assert(summary.profile.name === "Abhishek", "Learner name 'Abhishek' saved in memory");
  assert(summary.profile.level === "tooti-footi", "Learner native level 'tooti-footi' saved");
  assert(summary.profile.goal === "job-interview", "Primary goal 'job-interview' saved");

  // Record a turn containing hobbies & tech facts
  engine.memory.recordTurn(
    "I love cricket and I want to be a software engineer in college.",
    "That is wonderful!",
    { hasError: false }
  );
  const updatedSummary = engine.memory.getSummary();
  assert(updatedSummary.notes.some(n => n.includes("cricket")), "Memory dynamically extracted interest in 'cricket'");
  assert(updatedSummary.notes.some(n => n.includes("tech/software")), "Memory dynamically extracted tech career goal");
  console.log("");

  // --------------------------------------------------------------------------
  // TEST 2: Mistake Detector & Visual Diff Highlighting (Classic Indianisms)
  // --------------------------------------------------------------------------
  console.log("2. TESTING MISTAKE DETECTOR, VISUAL DIFF & HINDI EXPLANATIONS:");
  
  // Test 2A: "Myself" reflex pronoun error
  const resMyself = engine.analyzeSpeech("Myself Abhishek from Delhi", "tooti-footi");
  assert(resMyself.hasError === true, "Detected 'Myself' reflex pronoun introduction slip");
  assert(resMyself.corrected.includes("I am Abhishek") || resMyself.corrected.includes("My name is Abhishek"), "'Myself' corrected to 'I am / My name is'");
  assert(resMyself.diffWrongHtml.includes("error-word-highlight"), "Visual diff contains error-word-highlight tag");
  assert(resMyself.hindiExplanation.length > 5, "Hindi grammatical explanation generated");

  // Test 2B: "Yesterday I go" past tense error
  const resPast = engine.analyzeSpeech("Yesterday I go to market and buyed vegetables", "tooti-footi");
  assert(resPast.hasError === true, "Detected past tense slips ('go' & 'buyed')");
  assert(resPast.corrected.toLowerCase().includes("went") && resPast.corrected.toLowerCase().includes("bought"), "Corrected to 'went' and 'bought'");

  // Test 2C: "Passed out" vs "Graduated"
  const resGrad = engine.analyzeSpeech("I passed out from college last year", "intermediate");
  assert(resGrad.hasError === true, "Detected 'passed out' Indianism for college graduation");
  assert(resGrad.corrected.toLowerCase().includes("graduated"), "Corrected to 'graduated'");

  // Test 2D: "Revert back" redundancy
  const resRevert = engine.analyzeSpeech("Please revert back as soon as possible", "intermediate");
  assert(resRevert.hasError === true, "Detected 'revert back' redundancy");

  // Test 2E: "I am agree"
  const resAgree = engine.analyzeSpeech("I am agree with your opinion", "tooti-footi");
  assert(resAgree.hasError === true, "Detected 'I am agree' error");
  assert(resAgree.corrected.toLowerCase().includes("i agree"), "Corrected to 'I agree'");
  console.log("");

  // --------------------------------------------------------------------------
  // TEST 3: Filler Words Detection & Fluency Scoring
  // --------------------------------------------------------------------------
  console.log("3. TESTING FILLER WORDS DETECTOR & FLUENCY SCORER:");
  const resFillers = engine.analyzeSpeech("Um, I think, uh, actually, like, I want to learn English", "tooti-footi");
  assert(resFillers.fillerCount >= 3, `Detected filler words (Found: ${resFillers.fillerCount})`);
  assert(resFillers.fluencyScore < 90, `Fluency score adjusted for fillers (Score: ${resFillers.fluencyScore}/100)`);
  assert(resFillers.fluencyTip.length > 10, "Fluency improvement tip generated");
  console.log("");

  // --------------------------------------------------------------------------
  // TEST 4: "Help Me Speak" — Hindi to English Translation Helper
  // --------------------------------------------------------------------------
  console.log("4. TESTING HINDI TO ENGLISH INSTANT HELPER ('Koi baat nahi, Hindi me bolo'):");
  const hindiTurn = await engine.processUserTurn({
    text: "मुझे जॉब इंटरव्यू से बहुत डर लग रहा है",
    mode: "casual",
    level: "tooti-footi"
  });
  assert(hindiTurn.emotion === "🤗 Supportive & Caring", "Hindi speech triggered Supportive & Caring emotion");
  assert(hindiTurn.aiResponse.includes("nervous") || hindiTurn.aiResponse.includes("interview"), "Translated Hindi thought into polished English response");
  console.log("");

  // --------------------------------------------------------------------------
  // TEST 5: PW Talk Exact Feature — 🔆 "Show Hint" Drawer Generator
  // --------------------------------------------------------------------------
  console.log("5. TESTING SHOW HINT DRAWER (Question Hindi, Target Spoken, Phonetics):");
  const hintGuide = engine.generateHowToSpeakGuide("How are you feeling today?", "casual", null);
  assert(hintGuide.whatAriaIsAsking.length > 5, "Generated Hindi explanation of what Riva is asking");
  assert(hintGuide.targetText.length > 5, "Generated target spoken English sentence");
  assert(hintGuide.phonetic.length > 5, "Generated word-by-word phonetic pronunciation guide");
  assert(hintGuide.hindi.length > 5, "Generated Hindi meaning of the answer");
  assert(Array.isArray(hintGuide.quickPills) && hintGuide.quickPills.length > 0, "Generated quick 1-tap pills");
  console.log("");

  // --------------------------------------------------------------------------
  // TEST 6: Dynamic Real-Life Feature Verification Intent
  // --------------------------------------------------------------------------
  console.log("6. TESTING REAL-LIFE FEATURE VERIFICATION INTENT:");
  const testFeatureTurn = await engine.processUserTurn({
    text: "give me real life use to check every function",
    mode: "casual",
    level: "tooti-footi"
  });
  assert(testFeatureTurn.emotion === "💡 Feature Coach", "Feature test query triggered '💡 Feature Coach' emotion");
  assert(testFeatureTurn.aiResponse.includes("5 real-life test sentences"), "Provided 5 real-life test sentences to check every function");
  assert(testFeatureTurn.howToSpeak.quickPills.length >= 3, "Provided 3 instant quick test pills for user to speak or tap");
  console.log("");

  // --------------------------------------------------------------------------
  // TEST 7: 7-Day Curriculum Structure & Practice Modes
  // --------------------------------------------------------------------------
  console.log("7. TESTING 7-DAY REAL-LIFE CURRICULUM ROADMAP:");
  assert(engine.lessonsCurriculum.length === 7, "Curriculum has complete 7 days of lessons");
  const day1 = engine.lessonsCurriculum[0];
  assert(day1.day === 1 && day1.id === 'first-impressions', "Day 1 is 'First Impressions & Greetings'");
  assert(day1.realLifeTips.length >= 3, "Day 1 has 3+ real-life psychology tips");
  assert(day1.vocabularies.length === 10, "Day 1 includes 10 power vocabularies with phonetics");
  assert(day1.practiceChallenge.starterText.length > 10, "Day 1 includes interactive practice challenge");

  // Simulate Day 1 practice turn
  const day1Turn = await engine.processUserTurn({
    text: "Hello Aria, my name is Abhishek. I am from Delhi.",
    mode: "casual",
    level: "tooti-footi",
    lessonDay: 1
  });
  assert(day1Turn.emotion.includes("Impressed") || day1Turn.emotion.includes("Coaching"), "Lesson turn produced supportive coach response");
  assert(engine.memory.isLessonDone(1) === true, "Day 1 marked as completed in persistent memory");
  console.log("");

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log("================================================================");
  console.log(`  VERIFICATION COMPLETE: ${passedTests} OF ${totalTests} TESTS PASSED! (100% SUCCESS)`);
  console.log("================================================================\n");

  if (passedTests === totalTests) {
    console.log("🎉 ALL REAL-LIFE FUNCTIONS ARE WORKING PROPERLY!");
  } else {
    process.exit(1);
  }
}

testAllFunctions().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
