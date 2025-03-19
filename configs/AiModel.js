const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const courseOutlineAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate a study material for python for exam and level of difficulty will be easy with summery of course, List of Chapters along with summery for each chapter, topic list in each chapter, all result in JSON format."},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"courseTitle\": \"Introduction to Python Programming (Easy)\",\n  \"courseSummary\": \"This course provides a beginner-friendly introduction to Python programming.  It covers fundamental concepts and syntax, enabling students to write basic Python programs.  The focus is on understanding core principles rather than advanced techniques.\",\n  \"chapters\": [\n    {\n      \"chapterTitle\": \"Chapter 1: Introduction to Python\",\n      \"chapterSummary\": \"This chapter introduces Python, its applications, and setting up the programming environment.  It covers basic syntax and running your first Python program.\",\n      \"topics\": [\n        \"What is Python?\",\n        \"Why use Python?\",\n        \"Installing Python\",\n        \"Setting up a development environment (IDE/text editor)\",\n        \"Running your first Python program\",\n        \"Basic Syntax: Indentation, Comments\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Chapter 2: Data Types and Variables\",\n      \"chapterSummary\": \"This chapter explores fundamental data types in Python, including integers, floats, strings, and booleans, and how to work with variables.\",\n      \"topics\": [\n        \"Integers\",\n        \"Floating-point numbers\",\n        \"Strings\",\n        \"Booleans\",\n        \"Variables and assignment\",\n        \"Type conversion\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Chapter 3: Operators\",\n      \"chapterSummary\": \"This chapter covers various operators in Python, including arithmetic, comparison, logical, and assignment operators.\",\n      \"topics\": [\n        \"Arithmetic operators (+, -, *, /, //, %, **)\",\n        \"Comparison operators (==, !=, >, <, >=, <=)\",\n        \"Logical operators (and, or, not)\",\n        \"Assignment operators (=, +=, -=, *=, /=)\",\n        \"Operator precedence\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Chapter 4: Control Flow (Conditional Statements)\",\n      \"chapterSummary\": \"This chapter explains how to control the flow of execution in a program using if, elif, and else statements.\",\n      \"topics\": [\n        \"if statement\",\n        \"if-else statement\",\n        \"if-elif-else statement\",\n        \"Nested conditional statements\",\n        \"Boolean expressions\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Chapter 5: Loops\",\n      \"chapterSummary\": \"This chapter introduces for and while loops for iterating over sequences and performing repetitive tasks.\",\n      \"topics\": [\n        \"for loop\",\n        \"while loop\",\n        \"Loop control statements (break, continue)\",\n        \"Nested loops\",\n        \"Iterating through strings and lists\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Chapter 6: Data Structures: Lists and Tuples\",\n      \"chapterSummary\": \"This chapter introduces lists and tuples, fundamental data structures for storing collections of items.\",\n      \"topics\": [\n        \"Lists: creation, accessing elements, methods (append, insert, remove, etc.)\",\n        \"Tuples: creation, accessing elements, immutability\",\n        \"List slicing\",\n        \"List comprehension (basic introduction)\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Chapter 7: Functions\",\n      \"chapterSummary\": \"This chapter explains how to define and use functions to modularize code and improve reusability.\",\n      \"topics\": [\n        \"Defining functions\",\n        \"Function arguments and parameters\",\n        \"Return values\",\n        \"Function calls\",\n        \"Scope of variables\"\n      ]\n    },\n    {\n      \"chapterTitle\": \"Chapter 8: Input and Output\",\n      \"chapterSummary\": \"This chapter covers how to get input from the user and display output to the console.\",\n      \"topics\": [\n        \"Input function (input())\",\n        \"Print function (print())\",\n        \"Formatting output using f-strings\"\n      ]\n    }\n  ]\n}\n```\n"},
      ],
    },
  ],
});

// Define an async function to send messages
export async function sendCourseOutlineMessage(userInput) {
  const result = await courseOutlineAIModel.sendMessage(userInput);
  return result.response.text();
}

// Example usage
async function run() {
  try {
    const response = await sendCourseOutlineMessage("Tell me more about Python functions");
    console.log(response);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the run function
run();