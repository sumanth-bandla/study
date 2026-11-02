export type TutorMode = 
  | 'simple_explain' 
  | 'short_notes' 
  | 'seven_mark_answer' 
  | 'important_questions' 
  | 'step_by_step' 
  | 'practice_mcqs' 
  | 'revision_summary';

export interface AIRequestParams {
  subjectName: string;
  unitNumber: number;
  unitTitle: string;
  topicTitle: string;
  mode: TutorMode;
  userPrompt?: string;
  studyMaterialContext?: string;
  apiKey?: string;
}

export const generateAITutorResponse = async (params: AIRequestParams): Promise<string> => {
  const {
    subjectName,
    unitNumber,
    unitTitle,
    topicTitle,
    mode,
    userPrompt = '',
    studyMaterialContext = '',
    apiKey = ''
  } = params;

  let promptInstruction = '';

  switch (mode) {
    case 'simple_explain':
      promptInstruction = `Explain the concept of "${topicTitle}" in clear, easy-to-understand English for an undergraduate engineering student. Use a simple real-world analogy first, then explain the technical mechanism and why it matters in practical engineering.`;
      break;

    case 'short_notes':
      promptInstruction = `Generate high-yield, exam-focused revision bullet notes for "${topicTitle}". Structure them as:
1. Core Definition & Principle
2. Essential Formulas / Architecture Points
3. Key Components / Characteristics
4. Common Exam Mistakes & Traps to Avoid.`;
      break;

    case 'seven_mark_answer':
      promptInstruction = `Write a comprehensive, full-credit 7-MARK UNIVERSITY EXAM ANSWER for: "${topicTitle}".
Format it exactly as required in university evaluations:
1. **Overview & Precise Definition** (Clear 2-line statement)
2. **System Architecture / Block Diagram Representation** (Provide an ASCII or structured diagram layout)
3. **Working Principle & Detailed Technical Mechanism** (Explained in numbered steps)
4. **Key Advantages and Limitations** (Provide a neat comparison table)
5. **Real-World Engineering Application**
6. **Summary / Conclusion**.`;
      break;

    case 'important_questions':
      promptInstruction = `Provide the top 5 most frequently asked university examination questions for "${topicTitle}" and Unit ${unitNumber}: "${unitTitle}".
Classify them clearly into:
- 2-Mark Short Conceptual Questions
- 7-Mark Long Analytical / Numerical / Architecture Questions.
Provide brief answer tips for each.`;
      break;

    case 'step_by_step':
      promptInstruction = `Provide a step-by-step conceptual breakdown or mathematical derivation for "${topicTitle}". Break down the operational workflow step-by-step with practical numerical examples if applicable.`;
      break;

    case 'practice_mcqs':
      promptInstruction = `Generate 4 high-quality multiple choice questions (MCQs) for "${topicTitle}".
Return the response STRICTLY as a valid JSON array of objects with no surrounding markdown backticks if possible.
Format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why option A is correct."
  }
]`;
      break;

    case 'revision_summary':
      promptInstruction = `Provide a rapid 3-minute revision summary for "${topicTitle}". Highlight essential definitions, must-remember equations, and last-minute exam pointers.`;
      break;
  }

  const promptContent = `
You are STUDYHUB AI, an expert engineering professor and university exam tutor.
Syllabus Context:
- Subject: ${subjectName}
- Unit ${unitNumber}: ${unitTitle}
- Target Topic: ${topicTitle}

${studyMaterialContext ? `Ground Truth Study Material Provided by Student:\n${studyMaterialContext}\n(Ground your answer strictly on this material to avoid hallucination)\n` : ''}

${userPrompt ? `Student Custom Question: ${userPrompt}\n` : ''}

Task:
${promptInstruction}
  `;

  const effectiveKey = apiKey || localStorage.getItem('STUDYHUB_GEMINI_KEY') || '';

  if (!effectiveKey) {
    // Rich Offline / Demo Academic Tutor response
    return `### 💡 STUDYHUB AI Academic Tutor [Offline / Demo Mode]
> *To connect real-time Gemini generation, enter your Gemini API key in the top navigation or Settings.*

#### 📘 Topic: **${topicTitle}**
*Subject:* **${subjectName}** | *Unit ${unitNumber}:* ${unitTitle}

---

### 1. Conceptual Overview
The topic **${topicTitle}** is an essential unit objective in **${unitTitle}**. In B.Tech university examinations, questions on this topic test both theoretical foundations and structural implementation principles.

### 2. High-Yield Academic Points
- **Core Principle:** Provides modular, robust engineering architecture with predictable runtime complexity.
- **Exam Weightage:** Frequently asked as a **7-mark long question** or as a 2-mark definition.
- **Key Strategy:** Always sketch the block diagram or flowchart in the exam paper first before writing explanatory paragraphs.

### 3. Recommended Exam Structure (For Full Marks)
1. Write a formal 2-line definition at the top.
2. Provide a clean, labeled architecture diagram.
3. Use bullet points and tabulate comparisons rather than writing continuous paragraphs.

*(Enter your Gemini API key to unlock full live AI generation, 7-mark custom answers, and interactive MCQ quizzes!)*`;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptContent }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return textOutput || 'No response generated. Please check your query and retry.';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return `### ⚠️ Gemini API Notice\nError calling Gemini: ${error.message || error}\nPlease check your API key in Settings.`;
  }
};
