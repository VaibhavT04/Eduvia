const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
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
          {text: "generate a study material for python for exam Exam and level of difficulty will be EASY with summery of course,List of Chapters along with summery for each chapter,Topic list in each chapter,All result in JSON format"},
        ],
      }, 
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"course_title\": \"Python for Beginners (Easy Level)\",\n  \"course_summary\": \"This course provides a gentle introduction to the Python programming language. It covers fundamental concepts such as data types, variables, control flow, functions, and basic data structures.  The focus is on building a solid foundation for further exploration of Python's vast capabilities.\",\n  \"difficulty_level\": \"EASY\",\n  \"chapters\": [\n    {\n      \"chapter_number\": 1,\n      \"chapter_title\": \"Introduction to Python\",\n      \"chapter_summary\": \"This chapter introduces Python's origins, features, and why it's a popular choice for beginners.  It guides you through installing Python and setting up a development environment.\",\n      \"topics\": [\n        \"What is Python?\",\n        \"History of Python\",\n        \"Features of Python (easy to learn, versatile, large community)\",\n        \"Why learn Python?\",\n        \"Applications of Python (brief overview)\",\n        \"Installing Python (step-by-step guide)\",\n        \"Setting up a development environment (IDEs: VS Code, Thonny, IDLE)\",\n        \"Running your first Python program ('Hello, World!')\"\n      ]\n    },\n    {\n      \"chapter_number\": 2,\n      \"chapter_title\": \"Variables and Data Types\",\n      \"chapter_summary\": \"This chapter covers the fundamental building blocks of Python: variables and data types. You'll learn how to store information in variables and work with different data types like integers, floats, strings, and booleans.\",\n      \"topics\": [\n        \"What is a variable?\",\n        \"Declaring variables\",\n        \"Assigning values to variables\",\n        \"Naming conventions for variables\",\n        \"Data Types:\",\n        \"   - Integer (int)\",\n        \"   - Float (float)\",\n        \"   - String (str)\",\n        \"   - Boolean (bool)\",\n        \"Type Conversion (casting)\",\n        \"Using the `type()` function\",\n        \"Basic arithmetic operators (+, -, *, /, //, %, **)\"\n      ]\n    },\n    {\n      \"chapter_number\": 3,\n      \"chapter_title\": \"Input and Output\",\n      \"chapter_summary\": \"This chapter teaches you how to interact with the user by taking input and displaying output.  You'll learn how to use the `input()` and `print()` functions effectively.\",\n      \"topics\": [\n        \"The `print()` function (displaying output)\",\n        \"String formatting with `f-strings`\",\n        \"The `input()` function (taking user input)\",\n        \"Converting input to different data types (e.g., `int()`, `float()`)\",\n        \"Displaying formatted output using placeholders\"\n      ]\n    },\n    {\n      \"chapter_number\": 4,\n      \"chapter_title\": \"Control Flow: Conditional Statements\",\n      \"chapter_summary\": \"This chapter introduces the concept of control flow, allowing your programs to make decisions based on conditions.  You'll learn how to use `if`, `elif`, and `else` statements to execute different blocks of code.\",\n      \"topics\": [\n        \"Conditional Statements:\",\n        \"   - `if` statement\",\n        \"   - `else` statement\",\n        \"   - `elif` statement\",\n        \"Comparison operators (==, !=, >, <, >=, <=)\",\n        \"Logical operators (and, or, not)\",\n        \"Nested `if` statements (optional)\"\n      ]\n    },\n    {\n      \"chapter_number\": 5,\n      \"chapter_title\": \"Control Flow: Loops\",\n      \"chapter_summary\": \"This chapter focuses on loops, which allow you to repeat a block of code multiple times.  You'll learn about `for` and `while` loops and how to use them for different purposes.\",\n      \"topics\": [\n        \"Loops:\",\n        \"   - `for` loop (iterating over a sequence)\",\n        \"   - `while` loop (repeating while a condition is true)\",\n        \"The `range()` function\",\n        \"The `break` statement (exiting a loop)\",\n        \"The `continue` statement (skipping to the next iteration)\",\n        \"Nested loops (optional)\"\n      ]\n    },\n    {\n      \"chapter_number\": 6,\n      \"chapter_title\": \"Data Structures: Lists\",\n      \"chapter_summary\": \"This chapter introduces lists, one of the most fundamental data structures in Python.  You'll learn how to create, access, modify, and manipulate lists.\",\n      \"topics\": [\n        \"What is a list?\",\n        \"Creating lists\",\n        \"Accessing list elements (indexing)\",\n        \"List slicing\",\n        \"List methods:\",\n        \"   - `append()`\",\n        \"   - `insert()`\",\n        \"   - `remove()`\",\n        \"   - `pop()`\",\n        \"   - `len()`\",\n        \"   - `sort()`\",\n        \"List comprehension (brief introduction)\"\n      ]\n    },\n    {\n      \"chapter_number\": 7,\n      \"chapter_title\": \"Functions\",\n      \"chapter_summary\": \"This chapter introduces the concept of functions, reusable blocks of code that perform specific tasks.  You'll learn how to define, call, and pass arguments to functions.\",\n      \"topics\": [\n        \"What is a function?\",\n        \"Defining functions using `def`\",\n        \"Function parameters (arguments)\",\n        \"Returning values from functions\",\n        \"Calling functions\",\n        \"Docstrings (documenting functions)\",\n        \"Scope of variables (local vs. global - basic concept)\"\n      ]\n    }\n  ]\n}\n```"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());


run();