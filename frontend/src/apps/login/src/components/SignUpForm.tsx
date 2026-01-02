import { useState } from "react";
import Button from "shared/Button";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const steps = [
  { id: 1, title: "User Information" },
  { id: 2, title: "Account Details" },
];

export function SignUpForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === steps.length) {
      console.log("Form submitted:", formData);
      // Handle form submission
    } else {
      handleNext();
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="w-full max-w-md mx-auto px-8">
      <div className="mb-10">
        <h1 className="text-3xl mb-2">Tutor Registration</h1>
        <p className="text-gray-600">Join Champ Code Academy</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  step.id <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id}
              </div>
              <span className={`text-xs text-center ${
                step.id <= currentStep ? "text-blue-600" : "text-gray-500"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm mb-2 text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                At least 8 characters with letters and numbers
              </p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-2 text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={handleBack}
              variant="secondary"
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            {currentStep === steps.length ? "Create Account" : "Continue"}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Button onClick={onSwitchToLogin} variant="link">
          Sign in
        </Button>
      </p>
    </div>
  );
}