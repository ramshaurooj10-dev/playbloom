import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Users,
  Target,
  FileText,
  Search,
  Zap,
  HelpCircle,
  FolderOpen,
  Layers,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { LEARNING_AREAS_INFO } from '../../data/learningItems';
import { READY_MADE_LESSONS, PreschoolLessonPlan } from '../../data/readyMadeLessons';

interface LessonPlannerToolProps {
  onBackToOverview?: () => void;
}

type PlannerViewMode = 'HOME' | 'READY_MADE_LIST' | 'READY_MADE_VIEW' | 'MAKER_FORM' | 'MAKER_RESULT';

export const LessonPlannerTool: React.FC<LessonPlannerToolProps> = ({ onBackToOverview }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<PlannerViewMode>('HOME');
  const [selectedLesson, setSelectedLesson] = useState<PreschoolLessonPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Lesson Maker Form State
  const [makerTopic, setMakerTopic] = useState('');
  const [makerAgeGroup, setMakerAgeGroup] = useState('3–4 Years (Preschool)');
  const [makerClassGroup, setMakerClassGroup] = useState('Preschool Classroom');
  const [makerDuration, setMakerDuration] = useState('30 Minutes');
  const [generatedCustomPlan, setGeneratedCustomPlan] = useState<PreschoolLessonPlan | null>(null);

  // Copy helper
  const handleCopyText = (text: string, key: string) => {
    soundManager.playPop();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Print helper
  const handlePrint = () => {
    soundManager.playPop();
    window.print();
  };

  // Helper: Open Ready-Made Lesson
  const handleOpenLesson = (lesson: PreschoolLessonPlan) => {
    soundManager.playPop();
    setSelectedLesson(lesson);
    setCurrentView('READY_MADE_VIEW');
  };

  // Helper to intelligently infer learning area and outcomes from topic
  const inferCurriculumConnection = (topic: string) => {
    const t = topic.toLowerCase();

    if (t.includes('shape') || t.includes('triangle') || t.includes('circle') || t.includes('square') || t.includes('red') || t.includes('blue') || t.includes('yellow') || t.includes('green') || t.includes('color')) {
      return {
        area: 'Colors & Shapes',
        areaId: 'colors_shapes',
        icon: '🎨',
        outcomes: [
          `Identifies, names, and discriminates core attributes of ${topic}`,
          'Develops visual discrimination and spatial configuration awareness',
          'Sorts and matches objects by physical characteristics and hues',
          'Expresses observations using clear descriptive vocabulary'
        ]
      };
    }

    if (t.includes('count') || t.includes('number') || t.includes('math') || t.includes('pattern') || t.includes('more') || t.includes('less') || t.includes('measure') || t.includes('size')) {
      return {
        area: 'Early Math',
        areaId: 'math',
        icon: '🔢',
        outcomes: [
          `Demonstrates one-to-one correspondence and quantitative reasoning in ${topic}`,
          'Recognizes mathematical symbols, quantities, and sequential progressions',
          'Applies comparative reasoning (more/less, big/small, before/after)',
          'Engages in tactile manipulative counting and problem solving'
        ]
      };
    }

    if (t.includes('letter') || t.includes('rhyme') || t.includes('sound') || t.includes('phonics') || t.includes('story') || t.includes('book') || t.includes('read') || t.includes('alphabet')) {
      return {
        area: 'Early Literacy',
        areaId: 'literacy',
        icon: '📚',
        outcomes: [
          `Develops phonological awareness and receptive vocabulary for ${topic}`,
          'Engages in active listening, story recall, and oral expressive sharing',
          'Recognizes letter-sound relationships and print concepts in context',
          'Builds early comprehension through teacher-guided questioning'
        ]
      };
    }

    if (t.includes('feel') || t.includes('emotion') || t.includes('friend') || t.includes('share') || t.includes('problem') || t.includes('solve')) {
      return {
        area: 'Thinking & Problems',
        areaId: 'problem_solving',
        icon: '💡',
        outcomes: [
          `Recognizes and communicates personal emotions and social cues in ${topic}`,
          'Practices positive self-regulation and cooperative problem-solving strategies',
          'Develops empathy, perspective-taking, and peer collaboration skills',
          'Expresses solutions through roleplay and peaceful classroom dialogue'
        ]
      };
    }

    if (t.includes('sort') || t.includes('big') || t.includes('small') || t.includes('heavy') || t.includes('light') || t.includes('same') || t.includes('different') || t.includes('logic')) {
      return {
        area: 'Logic & Sorting',
        areaId: 'logic',
        icon: '🧩',
        outcomes: [
          `Classifies and categorizes items based on 1 to 2 distinct criteria in ${topic}`,
          'Explores logical hierarchies and comparative ordering relationships',
          'Strengthens cognitive cognitive flexibility through sorting puzzles',
          'Explains reasoning behind classification choices to peers'
        ]
      };
    }

    if (t.includes('cut') || t.includes('draw') || t.includes('dough') || t.includes('trace') || t.includes('finger') || t.includes('craft') || t.includes('bead') || t.includes('motor')) {
      return {
        area: 'Fine Motor Practice',
        areaId: 'fine_motor',
        icon: '✍️',
        outcomes: [
          `Strengthens pincer grasp, palmar arches, and wrist stability through ${topic}`,
          'Refines hand-eye coordination and bilateral integration techniques',
          'Demonstrates controlled tool usage (safety scissors, tongs, pipettes, crayons)',
          'Builds stamina for future handwriting and precise manipulation'
        ]
      };
    }

    if (t.includes('see') || t.includes('hear') || t.includes('taste') || t.includes('smell') || t.includes('touch') || t.includes('focus') || t.includes('look') || t.includes('spot')) {
      return {
        area: 'Focus & Observation',
        areaId: 'focus',
        icon: '🔍',
        outcomes: [
          `Maintains sustained visual and auditory attention during ${topic}`,
          'Notices subtle sensory details, textures, and environmental changes',
          'Develops mindful sensory vocabulary to describe real-time experiences',
          'Follows multi-step observational directions with enthusiasm'
        ]
      };
    }

    // Default to Everyday Knowledge
    return {
      area: 'Everyday Knowledge',
      areaId: 'knowledge',
      icon: '🌍',
      outcomes: [
        `Broadens contextual understanding and natural inquiry about ${topic}`,
        'Connects classroom discoveries to home routines and community roles',
        'Investigates cause-and-effect relationships through hands-on exploration',
        'Expands descriptive and conceptual vocabulary during group sharing'
      ]
    };
  };

  // Handler: Generate Custom Lesson Plan in Maker
  const handleGenerateCustomPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!makerTopic.trim()) return;

    soundManager.playPop();

    const topicClean = makerTopic.trim();
    const curriculum = inferCurriculumConnection(topicClean);
    const isShortDuration = makerDuration.includes('15') || makerDuration.includes('20');
    const isLongDuration = makerDuration.includes('45');
    const isYoungAge = makerAgeGroup.includes('2') || makerAgeGroup.includes('Toddler');

    const generated: PreschoolLessonPlan = {
      id: `custom-lesson-${Date.now()}`,
      topicNumber: 99,
      title: topicClean.toUpperCase(),
      icon: curriculum.icon,
      emoji: '🌟',
      ageGroup: makerAgeGroup,
      classGroup: makerClassGroup,
      duration: makerDuration,
      learningArea: curriculum.area,
      learningAreaId: curriculum.areaId,
      shortDescription: `Customized preschool lesson on ${topicClean}, specifically adapted for ${makerAgeGroup} with ${makerDuration} hands-on pacing.`,
      learningOutcomes: curriculum.outcomes,
      learningObjectives: `Children will actively explore, identify, and express core concepts of "${topicClean}" through multisensory circle time, teacher-guided modeling, and hands-on discovery activities suitable for ${makerAgeGroup}.`,
      materialsNeeded: [
        `Sensory Mystery Box / Treasure Basket containing 4–5 tangible examples of ${topicClean}`,
        `Large visual photographic flashcards depicting ${topicClean} in real-life contexts`,
        `Low floor sorting mats / color-coded activity trays for small group exploration`,
        `Age-appropriate manipulatives (e.g. wooden blocks, tactile counters, or playdough)`,
        `Chart paper, vibrant child-safe markers, and tactile reward stickers`
      ],
      introductionWarmUp: isYoungAge
        ? `Gather children in a snug circle on the carpet. Sing a lively rhythmic opening chant introducing ${topicClean} with simple body movements (clapping, stomping, stretching tall). Reach into the colorful Mystery Bag with playful suspense: "Peek-a-boo! What surprise is hiding inside for us today?"`
        : `Gather children in the discovery circle. Present an intriguing visual prompt or sensory artifact connected to ${topicClean}. Ask: "Put on your detective thinking caps! What clues do our curious eyes and listening ears notice about this special item today?"`,
      teachingSteps: [
        {
          stepNumber: 1,
          title: 'Sensory Exploration & Guided Observation',
          instruction: `Pass around tangible examples of ${topicClean}. Encourage children to use multiple senses (touching textures, observing colors, listening for sounds). Verbalize key descriptive words clearly.`
        },
        {
          stepNumber: 2,
          title: 'Interactive Concept Modeling & Air Tracing / Movement',
          instruction: `Demonstrate the core attribute of ${topicClean} on a whiteboard or floor mat. Have children mirror the concept using their bodies (e.g. tracing in the air, mimicking sounds, or demonstrating physical movements).`
        },
        {
          stepNumber: 3,
          title: isShortDuration ? 'Quick Hands-on Partner Practice' : 'Guided Exploration & Small-Group Station Setup',
          instruction: isShortDuration
            ? `Pair children up with 1 item to discuss and compare with their neighbor: "Show your partner what you noticed about ${topicClean}!"`
            : `Set up 2 interactive mini-stations: Station A for tactile building/sorting of ${topicClean}, and Station B for creative representation with art tools.`
        },
        ...(isLongDuration
          ? [
              {
                stepNumber: 4,
                title: 'Extended Guided Application & Deep Exploration',
                instruction: `Transition children to tabletop workstations for hands-on sensory playdough stamping, item sorting, or partner matching challenges with teacher facilitation.`
              }
            ]
          : [])
      ],
      teacherPrompts: [
        `"What does this remind you of from your home or outside in the park?"`,
        `"How can we describe ${topicClean} using our five senses words?"`,
        `"What happens if we look really closely at how this works?"`,
        `"Can you show a friend how you found that answer?"`
      ],
      childParticipationActivity: {
        title: `Hands-on "${topicClean}" Discovery Hunt & Creation`,
        instructions: `Children engage in a dynamic tactile activity where they handle, sort, build, or illustrate their own version of ${topicClean} using classroom manipulatives and art materials.`,
        handsOnFocus: `Multisensory integration, peer collaboration, fine motor coordination, and conceptual reinforcement.`
      },
      checkForUnderstanding: [
        `Can the child point out or hold up an example of ${topicClean} when requested?`,
        `Does the child use target vocabulary related to ${topicClean} during free dialogue?`,
        `Can the child explain one interesting fact or attribute they learned today?`
      ],
      assessment: `Observe each child during the hands-on participation activity. Note on the assessment checklist whether the child independently demonstrates understanding of ${topicClean} or requires supportive scaffolding.`,
      closingRecap: `Reconvene at the circle carpet. Conduct a 2-minute "Lightning Recap" where each child gives a high-five and shares their favorite discovery about ${topicClean} before transitioning to the next routine.`,
      optionalExtensionActivity: `Home-School Connection: Encourage children to spot 1 example of ${topicClean} with their families at home tonight and share it at morning circle tomorrow.`
    };

    setGeneratedCustomPlan(generated);
    setCurrentView('MAKER_RESULT');
  };

  // Helper: Format printable / copyable lesson text
  const generateLessonSlipText = (plan: PreschoolLessonPlan) => {
    return `=====================================================
PRESCHOOL LESSON PLAN
=====================================================
TOPIC: ${plan.title}
AGE GROUP: ${plan.ageGroup}
CLASS / GROUP: ${plan.classGroup}
DURATION: ${plan.duration}
LEARNING AREA: ${plan.learningArea}

-----------------------------------------------------
1. LEARNING OBJECTIVES
-----------------------------------------------------
${plan.learningObjectives}

-----------------------------------------------------
2. TARGET LEARNING OUTCOMES
-----------------------------------------------------
${plan.learningOutcomes.map((o) => `• ${o}`).join('\n')}

-----------------------------------------------------
3. MATERIALS NEEDED
-----------------------------------------------------
${plan.materialsNeeded.map((m) => `• ${m}`).join('\n')}

-----------------------------------------------------
4. INTRODUCTION / WARM-UP
-----------------------------------------------------
${plan.introductionWarmUp}

-----------------------------------------------------
5. STEP-BY-STEP TEACHING PLAN
-----------------------------------------------------
${plan.teachingSteps.map((s) => `Step ${s.stepNumber}: ${s.title}\n${s.instruction}`).join('\n\n')}

-----------------------------------------------------
6. TEACHER PROMPTS & QUESTIONS
-----------------------------------------------------
${plan.teacherPrompts.map((p) => `• ${p}`).join('\n')}

-----------------------------------------------------
7. CHILD PARTICIPATION ACTIVITY
-----------------------------------------------------
Activity Name: ${plan.childParticipationActivity.title}
Instructions: ${plan.childParticipationActivity.instructions}
Hands-On Focus: ${plan.childParticipationActivity.handsOnFocus}

-----------------------------------------------------
8. CHECK FOR UNDERSTANDING
-----------------------------------------------------
${plan.checkForUnderstanding.map((c) => `[✓] ${c}`).join('\n')}

-----------------------------------------------------
9. ASSESSMENT STRATEGY
-----------------------------------------------------
${plan.assessment}

-----------------------------------------------------
10. CLOSING / RECAP
-----------------------------------------------------
${plan.closingRecap}

-----------------------------------------------------
11. OPTIONAL EXTENSION ACTIVITY
-----------------------------------------------------
${plan.optionalExtensionActivity}

=====================================================
Preschool Educator Suite — Complete Classroom Lesson Plan
=====================================================`;
  };

  // Filter ready-made lessons
  const filteredLessons = READY_MADE_LESSONS.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.learningArea.toLowerCase().includes(q) ||
      l.shortDescription.toLowerCase().includes(q)
    );
  });

  return (
    <section id="educator-lesson-planner-card" className="bg-white border-4 border-blue-300 rounded-3xl p-5 sm:p-8 shadow-xl mb-8">
      {/* ========================================================================= */}
      {/* VIEW 1: LESSON PLANNER HOME — ONLY TWO LARGE INTERACTIVE OPTIONS           */}
      {/* ========================================================================= */}
      {currentView === 'HOME' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-blue-100 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-100 border-2 border-blue-300 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                📝
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Educator Card 2 • Lesson Planner
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                  Lesson Planner
                </h2>
              </div>
            </div>

            {onBackToOverview && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  onBackToOverview();
                }}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-slate-300 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Hub Cards</span>
              </button>
            )}
          </div>

          {/* Subtitle instructions */}
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Select an option below to explore our ready-to-teach curriculum library or generate an instant custom lesson plan for your classroom.
          </p>

          {/* ONLY TWO LARGE INTERACTIVE OPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* OPTION 1: READY-MADE LESSON PLANS */}
            <div
              onClick={() => {
                soundManager.playPop();
                setCurrentView('READY_MADE_LIST');
              }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50/70 border-3 border-blue-300 hover:border-blue-500 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group select-none relative overflow-hidden"
            >
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-200/30 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white border-2 border-blue-300 rounded-2xl flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <span className="text-[10px] font-black uppercase text-blue-900 bg-blue-200/80 px-3 py-1 rounded-full border border-blue-300">
                    15 Complete Plans
                  </span>
                </div>

                <span className="text-xs font-black uppercase tracking-wider text-blue-700 block mb-1">
                  Option 1
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-900 transition-colors">
                  Ready-Made Lesson Plans
                </h3>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-2">
                  Browse our complete library of 15 fully planned, classroom-ready preschool lessons covering Shapes, Colors, Numbers, Senses, Feelings, Animals, Food, and more.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-200/70 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">
                  Explore 15 Topics
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black px-4 py-2 rounded-xl bg-blue-600 text-white shadow-xs group-hover:bg-blue-700 transition-all">
                  <span>Open Library</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            {/* OPTION 2: LESSON PLAN MAKER */}
            <div
              onClick={() => {
                soundManager.playPop();
                setCurrentView('MAKER_FORM');
              }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50/70 border-3 border-emerald-300 hover:border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group select-none relative overflow-hidden"
            >
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-200/30 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white border-2 border-emerald-300 rounded-2xl flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                    ⚡
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-200/80 px-3 py-1 rounded-full border border-emerald-300">
                    Instant Generator
                  </span>
                </div>

                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block mb-1">
                  Option 2
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-900 transition-colors">
                  Lesson Plan Maker
                </h3>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-2">
                  Create a customized, step-by-step preschool lesson plan tailored immediately to your chosen topic, age group, classroom, and lesson duration.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200/70 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  Build Custom Plan
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black px-4 py-2 rounded-xl bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 transition-all">
                  <span>Start Maker</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: OPTION 1 — READY-MADE LESSON PLANS LIBRARY (15 LESSONS)           */}
      {/* ========================================================================= */}
      {currentView === 'READY_MADE_LIST' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-blue-100 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setCurrentView('HOME');
                }}
                className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-blue-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Planner Home</span>
              </button>

              <div>
                <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                  15 Ready-Made Plans
                </span>
                <h2 className="text-xl font-black text-slate-900 uppercase">
                  Ready-Made Preschool Lesson Plans
                </h2>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 15 topics..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* 15 Ready-Made Lesson Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleOpenLesson(lesson)}
                className="bg-white border-2 border-slate-200 hover:border-blue-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                      {lesson.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      Topic #{lesson.topicNumber}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-700 transition-colors">
                    {lesson.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mt-1 mb-2">
                    <span className="flex items-center gap-1 text-purple-700">
                      <Users className="w-3 h-3" />
                      <span>{lesson.ageGroup}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.duration}</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 line-clamp-2 leading-relaxed">
                    {lesson.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-blue-700">
                  <span className="text-[10px] uppercase text-slate-500 font-bold">
                    {lesson.learningArea}
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Open Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: FULL READY-MADE LESSON PLAN VIEW                                  */}
      {/* ========================================================================= */}
      {currentView === 'READY_MADE_VIEW' && selectedLesson && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-blue-100 pb-4 print:hidden">
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setCurrentView('READY_MADE_LIST');
              }}
              className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-black px-4 py-2 rounded-xl transition-colors cursor-pointer border border-blue-300 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lesson Plans</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyText(generateLessonSlipText(selectedLesson), 'readymade')}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-slate-300"
              >
                {copiedKey === 'readymade' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'readymade' ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT LESSON</span>
              </button>
            </div>
          </div>

          {/* Complete Lesson Plan Document Sheet */}
          <div className="bg-slate-50 border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Header Details */}
            <div className="border-b-2 border-slate-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black uppercase text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                  {selectedLesson.learningArea} • Topic #{selectedLesson.topicNumber}
                </span>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-lg">
                    Age: {selectedLesson.ageGroup}
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                    Class: {selectedLesson.classGroup}
                  </span>
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                    Duration: {selectedLesson.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-3xl sm:text-4xl">{selectedLesson.icon}</span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {selectedLesson.title}
                  </h2>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {selectedLesson.shortDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Learning Objectives & Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Learning Objectives</span>
                </h4>
                <p className="text-xs font-bold text-blue-900 leading-relaxed">
                  {selectedLesson.learningObjectives}
                </p>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Target Learning Outcomes</span>
                </h4>
                <ul className="space-y-1.5 text-xs font-bold text-emerald-900">
                  {selectedLesson.learningOutcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 2: Materials Needed */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4">
              <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5 mb-2">
                <span>📦 Materials Needed</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                {selectedLesson.materialsNeeded.map((mat, i) => (
                  <li key={i} className="flex items-start gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-blue-500 font-black">•</span>
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Introduction / Warm-Up */}
            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4">
              <h4 className="text-xs font-black uppercase text-amber-950 flex items-center gap-1.5 mb-1.5">
                <span>🌟 Introduction / Circle Time Warm-Up</span>
              </h4>
              <p className="text-xs font-bold text-amber-900 leading-relaxed">
                {selectedLesson.introductionWarmUp}
              </p>
            </div>

            {/* Section 4: Step-by-Step Teaching Plan */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                <span>👣 Step-by-Step Teaching Plan</span>
              </h4>
              <div className="space-y-2.5">
                {selectedLesson.teachingSteps.map((step) => (
                  <div key={step.stepNumber} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <h5 className="text-xs font-black text-slate-900 uppercase">
                        {step.title}
                      </h5>
                    </div>
                    <p className="text-xs font-bold text-slate-600 pl-7 leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Teacher Prompts & Questions */}
            <div className="bg-purple-50/70 border-2 border-purple-200 rounded-2xl p-4">
              <h4 className="text-xs font-black uppercase text-purple-950 flex items-center gap-1.5 mb-2">
                <span>💬 Teacher Prompts & Guiding Questions</span>
              </h4>
              <ul className="space-y-1.5 text-xs font-bold text-purple-900 italic">
                {selectedLesson.teacherPrompts.map((pr, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-black not-italic">"</span>
                    <span>{pr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 6: Child Participation Activity */}
            <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5">
                  <span>🎨 Child Participation Activity</span>
                </h4>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Active Learning
                </span>
              </div>
              <h5 className="text-sm font-black text-slate-900">
                {selectedLesson.childParticipationActivity.title}
              </h5>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                {selectedLesson.childParticipationActivity.instructions}
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] font-black text-emerald-900">
                <strong>Hands-On Focus:</strong> {selectedLesson.childParticipationActivity.handsOnFocus}
              </div>
            </div>

            {/* Section 7: Check for Understanding & Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-2">
                  🔍 Check for Understanding
                </h4>
                <ul className="space-y-1.5 text-xs font-bold text-slate-700">
                  {selectedLesson.checkForUnderstanding.map((chk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-black">✓</span>
                      <span>{chk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-2">
                  📊 Assessment Strategy
                </h4>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  {selectedLesson.assessment}
                </p>
              </div>
            </div>

            {/* Section 8: Closing Recap & Extension */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-1.5">
                  🏁 Closing / Recap
                </h4>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {selectedLesson.closingRecap}
                </p>
              </div>

              <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-1.5">
                  🚀 Optional Extension Activity
                </h4>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {selectedLesson.optionalExtensionActivity}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: OPTION 2 — LESSON PLAN MAKER FORM                                 */}
      {/* ========================================================================= */}
      {currentView === 'MAKER_FORM' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setCurrentView('HOME');
                }}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Planner Home</span>
              </button>

              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Custom Curriculum Generator
                </span>
                <h2 className="text-xl font-black text-slate-900 uppercase">
                  Lesson Plan Maker
                </h2>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Enter your lesson details below. The system will immediately generate a complete, tailored preschool lesson plan matching your classroom requirements.
          </p>

          {/* Form */}
          <form onSubmit={handleGenerateCustomPlan} className="bg-emerald-50/50 border-3 border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field 1: Topic / Lesson Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Topic / Lesson Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={makerTopic}
                  onChange={(e) => setMakerTopic(e.target.value)}
                  placeholder="e.g. Floating and Sinking, Ladybugs, Primary Colors, Five Senses, Counting to 5"
                  className="w-full bg-white border-2 border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-hidden shadow-xs"
                />
                {/* Quick Topic Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-black uppercase text-slate-500">
                    Quick Suggestions:
                  </span>
                  {['Sink or Float', 'Butterfly Lifecycle', 'Mixing Yellow & Blue', 'Five Senses Safari', 'Counting Farm Animals'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setMakerTopic(tag);
                      }}
                      className="text-[11px] font-black bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Age Group */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Age Group <span className="text-red-500">*</span>
                </label>
                <select
                  value={makerAgeGroup}
                  onChange={(e) => setMakerAgeGroup(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden shadow-xs"
                >
                  <option value="2–3 Years (Toddlers)">2–3 Years (Toddlers)</option>
                  <option value="3–4 Years (Preschool)">3–4 Years (Preschool)</option>
                  <option value="4–5 Years (Pre-K)">4–5 Years (Pre-K)</option>
                  <option value="5–6 Years (Kindergarten / Early Years)">5–6 Years (Kindergarten / Early Years)</option>
                </select>
              </div>

              {/* Field 3: Class / Group */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Class / Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={makerClassGroup}
                  onChange={(e) => setMakerClassGroup(e.target.value)}
                  placeholder="e.g. Preschool Room 2, Buttercups, Little Explorers"
                  className="w-full bg-white border-2 border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden shadow-xs"
                />
              </div>

              {/* Field 4: Lesson Duration */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Lesson Duration <span className="text-red-500">*</span>
                </label>
                <select
                  value={makerDuration}
                  onChange={(e) => setMakerDuration(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden shadow-xs"
                >
                  <option value="15 Minutes (Express Circle Time)">15 Minutes (Express Circle Time)</option>
                  <option value="20 Minutes (Standard Early Years)">20 Minutes (Standard Early Years)</option>
                  <option value="30 Minutes (Full Activity Session)">30 Minutes (Full Activity Session)</option>
                  <option value="45 Minutes (Extended Multi-Station)">45 Minutes (Extended Multi-Station)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-emerald-200 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase px-8 py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer hover:scale-105"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span>GENERATE LESSON PLAN IMMEDIATELY</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: MAKER GENERATED CUSTOM LESSON PLAN RESULT                         */}
      {/* ========================================================================= */}
      {currentView === 'MAKER_RESULT' && generatedCustomPlan && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-emerald-100 pb-4 print:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setCurrentView('MAKER_FORM');
                }}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-4 py-2 rounded-xl transition-colors cursor-pointer border border-slate-300 shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setCurrentView('HOME');
                }}
                className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-emerald-300"
              >
                <span>Planner Home</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyText(generateLessonSlipText(generatedCustomPlan), 'custom')}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-slate-300"
              >
                {copiedKey === 'custom' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'custom' ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT LESSON</span>
              </button>
            </div>
          </div>

          {/* Generated Lesson Document Sheet */}
          <div className="bg-slate-50 border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Header Details */}
            <div className="border-b-2 border-slate-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black uppercase text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  {generatedCustomPlan.learningArea} • Custom Plan
                </span>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-lg">
                    Age: {generatedCustomPlan.ageGroup}
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                    Class: {generatedCustomPlan.classGroup}
                  </span>
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                    Duration: {generatedCustomPlan.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-3xl sm:text-4xl">{generatedCustomPlan.icon}</span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {generatedCustomPlan.title}
                  </h2>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {generatedCustomPlan.shortDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Learning Objectives & Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Learning Objectives</span>
                </h4>
                <p className="text-xs font-bold text-blue-900 leading-relaxed">
                  {generatedCustomPlan.learningObjectives}
                </p>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Relevant Learning Outcomes</span>
                </h4>
                <ul className="space-y-1.5 text-xs font-bold text-emerald-900">
                  {generatedCustomPlan.learningOutcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 2: Materials Needed */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4">
              <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5 mb-2">
                <span>📦 Materials Needed</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                {generatedCustomPlan.materialsNeeded.map((mat, i) => (
                  <li key={i} className="flex items-start gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-emerald-500 font-black">•</span>
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Introduction / Warm-Up */}
            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4">
              <h4 className="text-xs font-black uppercase text-amber-950 flex items-center gap-1.5 mb-1.5">
                <span>🌟 Introduction / Circle Time Warm-Up</span>
              </h4>
              <p className="text-xs font-bold text-amber-900 leading-relaxed">
                {generatedCustomPlan.introductionWarmUp}
              </p>
            </div>

            {/* Section 4: Step-by-Step Teaching Plan */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                <span>👣 Step-by-Step Teaching Plan</span>
              </h4>
              <div className="space-y-2.5">
                {generatedCustomPlan.teachingSteps.map((step) => (
                  <div key={step.stepNumber} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <h5 className="text-xs font-black text-slate-900 uppercase">
                        {step.title}
                      </h5>
                    </div>
                    <p className="text-xs font-bold text-slate-600 pl-7 leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Teacher Prompts & Questions */}
            <div className="bg-purple-50/70 border-2 border-purple-200 rounded-2xl p-4">
              <h4 className="text-xs font-black uppercase text-purple-950 flex items-center gap-1.5 mb-2">
                <span>💬 Teacher Prompts & Guiding Questions</span>
              </h4>
              <ul className="space-y-1.5 text-xs font-bold text-purple-900 italic">
                {generatedCustomPlan.teacherPrompts.map((pr, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-black not-italic">"</span>
                    <span>{pr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 6: Children's Activity */}
            <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5">
                  <span>🎲 Children's Activity</span>
                </h4>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Classroom Engagement
                </span>
              </div>
              <h5 className="text-sm font-black text-slate-900">
                {generatedCustomPlan.childParticipationActivity.title}
              </h5>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                {generatedCustomPlan.childParticipationActivity.instructions}
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] font-black text-emerald-900">
                <strong>Hands-On Focus:</strong> {generatedCustomPlan.childParticipationActivity.handsOnFocus}
              </div>
            </div>

            {/* Section 7: Check for Understanding & Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-2">
                  🔍 Check for Understanding
                </h4>
                <ul className="space-y-1.5 text-xs font-bold text-slate-700">
                  {generatedCustomPlan.checkForUnderstanding.map((chk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span>{chk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-2">
                  📊 Assessment Strategy
                </h4>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  {generatedCustomPlan.assessment}
                </p>
              </div>
            </div>

            {/* Section 8: Closing Recap & Extension */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-1.5">
                  🏁 Closing / Recap
                </h4>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {generatedCustomPlan.closingRecap}
                </p>
              </div>

              <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-1.5">
                  🚀 Extension / Follow-Up Activity
                </h4>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {generatedCustomPlan.optionalExtensionActivity}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
