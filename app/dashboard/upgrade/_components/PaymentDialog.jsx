"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Paypal, Bitcoin, Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PaymentDialog({ isOpen, onClose, plan }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const router = useRouter();
  
  if (!plan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onClose();
      
      // Show success message
      toast.success(`Successfully subscribed to ${plan.name}!`, {
        description: "Your account has been upgraded and credits have been added.",
        duration: 5000,
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name}</DialogTitle>
          <DialogDescription>
            Enter your payment details to subscribe to the {plan.name} at {plan.price} {plan.duration}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Payment Method</Label>
              <RadioGroup 
                defaultValue="card" 
                value={paymentMethod} 
                onChange={setPaymentMethod}
                className="grid grid-cols-3 gap-4"
              >
                <div className="text-center">
                  <RadioGroupItem
                    value="card"
                    id="card"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="card"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-100 cursor-pointer ${
                      paymentMethod === 'card' ? 'border-primary ring-2 ring-primary/30' : ''
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    <span className="text-sm">Credit Card</span>
                  </Label>
                </div>
                
                <div className="text-center">
                  <RadioGroupItem
                    value="paypal"
                    id="paypal"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="paypal"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-100 cursor-pointer ${
                      paymentMethod === 'paypal' ? 'border-primary ring-2 ring-primary/30' : ''
                    }`}
                  >
                    <Paypal className="h-6 w-6 mb-2" />
                    <span className="text-sm">PayPal</span>
                  </Label>
                </div>
                
                <div className="text-center">
                  <RadioGroupItem
                    value="crypto"
                    id="crypto"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="crypto"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-gray-100 cursor-pointer ${
                      paymentMethod === 'crypto' ? 'border-primary ring-2 ring-primary/30' : ''
                    }`}
                  >
                    <Bitcoin className="h-6 w-6 mb-2" />
                    <span className="text-sm">Crypto</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Smith" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" required />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                `Pay ${plan.price}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentDialog; 