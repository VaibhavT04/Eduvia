"use client";
import { Button } from "@/components/ui/button";
import SelectOption from "./_components/SelectOption";
import React, { useState, useEffect } from "react";
import TopicInput from "./_components/TopicInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

function Create() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    studyType: "",
    topic: "",
    difficultyLevel: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, isLoaded: userLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load form data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem("courseOutlineFormData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && typeof parsed === "object") {
          setFormData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved form data, resetting:", e);
        localStorage.removeItem("courseOutlineFormData"); // Clear corrupted data
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("courseOutlineFormData", JSON.stringify(formData));
  }, [formData]);

  const handleUserInput = (fieldName, fieldValue) => {
    setError(""); // Clear any existing errors
    setSuccess(""); // Clear any existing success messages
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const validateStep = () => {
    if (step === 0 && !formData.studyType) {
      setError("Please select a study type to continue");
      return false;
    }
    if (step === 1) {
      if (!formData.topic || formData.topic.trim().length < 3) {
        setError("Please enter a valid topic (minimum 3 characters)");
        return false;
      }
      if (!formData.difficultyLevel) {
        setError("Please select a difficulty level");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const GenerateCourseOutline = async () => {
    if (!validateStep()) return;

    if (!userLoaded || !user) {
      setError("Please sign in to generate a course outline");
      return;
    }

    const courseId = uuidv4();
    setLoading(true);
    setError("");
    setSuccess("");

    const controller = new AbortController();
    try {
      const result = await axios.post(
        "/api/generate-course-outline",
        {
          courseId,
          topic: formData.topic.trim(),
          courseType: formData.studyType,
          difficultyLevel: formData.difficultyLevel,
          createdBy: user.primaryEmailAddress?.emailAddress || user.id,
        },
        { signal: controller.signal }
      );

      if (result.data?.success) {
        setSuccess("Your course outline has been generated successfully!");
        localStorage.removeItem("courseOutlineFormData"); // Clear saved data
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        throw new Error(result.data?.message || "Failed to generate course outline");
      }
    } catch (error) {
      if (error.name === "AbortError") return; // Ignore aborted requests
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to generate course outline";
      setError(errorMessage);
      console.error("Error generating course outline:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup for abort on unmount or loading change
  useEffect(() => {
    return () => {
      if (loading) {
        const controller = new AbortController();
        controller.abort();
      }
    };
  }, [loading]);

  return (
    <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
      <h2 className="font-bold text-3xl text-primary">
        Start Building Your Personal Study Material
      </h2>
      <p className="text-gray-500">
        Fill all details in order to generate study material for your next project
      </p>

      {error && (
        <div
          className="w-full mt-4 p-4 text-red-500 bg-red-50 rounded-md border border-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="w-full mt-4 p-4 text-green-500 bg-green-50 rounded-md border border-green-200"
          role="alert"
        >
          {success}
        </div>
      )}

      <div className="mt-10 w-full">
        {step === 0 ? (
          <SelectOption
            selectedStudyType={(value) => handleUserInput("studyType", value)}
            initialValue={formData.studyType}
          />
        ) : (
          <TopicInput
            setTopic={(value) => handleUserInput("topic", value)}
            setDifficultyLevel={(value) => handleUserInput("difficultyLevel", value)}
            initialTopic={formData.topic}
            initialDifficulty={formData.difficultyLevel}
          />
        )}
      </div>

      <div className="flex justify-between w-full mt-32">
        {step !== 0 ? (
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={loading}
            aria-label="Go to previous step"
          >
            Previous
          </Button>
        ) : (
          <div className="invisible">
            <Button variant="outline">Previous</Button>
          </div>
        )}

        {step === 0 ? (
          <Button onClick={handleNext} aria-label="Go to next step">
            Next
          </Button>
        ) : (
          <Button
            onClick={GenerateCourseOutline}
            disabled={loading || !userLoaded}
            className={loading ? "cursor-not-allowed" : ""}
            aria-busy={loading.toString()} // Convert to string for accessibility
            aria-label="Generate course outline"
          >
            {loading && <Loader className="animate-spin mr-2" />}
            {loading ? "Generating..." : "Generate"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Create;