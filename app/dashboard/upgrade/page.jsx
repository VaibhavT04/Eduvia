"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import PaymentDialog from "./_components/PaymentDialog";

function Upgrade() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const pricingPlans = [
    {
      name: "Basic Plan",
      price: "$9.99",
      duration: "per month",
      features: [
        "10 Courses per month",
        "Basic AI-generated content",
        "Standard support",
        "1 User",
      ],
      recommended: false,
      buttonText: "Get Started",
    },
    {
      name: "Standard Plan",
      price: "$19.99",
      duration: "per month",
      features: [
        "25 Courses per month",
        "Advanced AI-generated content",
        "Priority support",
        "3 Users",
        "Custom course branding",
      ],
      recommended: true,
      buttonText: "Recommended",
    },
    {
      name: "Premium Plan",
      price: "$39.99",
      duration: "per month",
      features: [
        "Unlimited Courses",
        "Premium AI-generated content",
        "24/7 Priority support",
        "10 Users",
        "Custom course branding",
        "Advanced analytics",
        "API access",
      ],
      recommended: false,
      buttonText: "Go Premium",
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentDialogOpen(true);
  };

  const closePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">Choose the plan that fits your needs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock more features and create more courses by upgrading to a premium plan.
          All plans include access to our AI-powered course generation technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index} 
            className={`border rounded-xl p-6 transition-all hover:shadow-lg ${
              plan.recommended ? 'border-primary ring-2 ring-primary/30 shadow-md' : 'border-gray-200'
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="flex justify-center items-end">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.duration}</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className={`w-full ${plan.recommended ? 'bg-primary hover:bg-primary/90' : ''}`}
              variant={plan.recommended ? 'default' : 'outline'}
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Need a custom plan for your organization?</h3>
        <p className="text-gray-600 mb-4">
          Contact our sales team for enterprise pricing and custom solutions.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>

      <PaymentDialog 
        isOpen={isPaymentDialogOpen} 
        onClose={closePaymentDialog} 
        plan={selectedPlan} 
      />
    </div>
  );
}

export default Upgrade; 