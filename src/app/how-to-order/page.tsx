'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function HowToOrderPage() {

  const steps = [
    {
      title: "1. Buy Product",
      description: "Click on the \"Buy Products\" button and select the product you want and the card type (e.g. PVC, Bamboo, Metal).",
    },
    {
      title: "2. Set QR Code Option",
      description: "Custom QR Code: If you want to use your own QR code, select this option and click \"Design Your Card\". Then upload your QR code. VibeCard QR Code: If you want to use VibeCard's QR code, first go to your VibeCard dashboard and click \"Get QR Code\" to go directly to your code. Take a screenshot of your QR code, return to the order and click \"Design Your Card\" to upload the screenshot.",
    },
    {
      title: "3. Design Card",
      description: "After clicking \"Design Your Card\" you can upload the QR code and optionally your logo. Customize the front and back of the card by adjusting background colors, text styles, and other design elements to your liking.",
    },
    {
      title: "4. Complete your order",
      description: "Click the \"Order\" button and enter your shipping and payment information to complete the order.",
    },
     {
      title: "Done!",
      description: "Your custom designed NFC business card will then be produced and shipped to you.",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline">How to Design and Order an NFC Business Card</h1>
        <p className="text-muted-foreground mt-2">A complete guide from purchase to production.</p>
      </header>

      <Card className="bg-card/50">
        <CardContent className="p-8">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center">
                  {step.title.startsWith("Done") ? <CheckCircle className="h-6 w-6"/> : <span className="font-bold text-lg">{index + 1}</span> }
                </div>
                <div>
                  <h3 className="text-xl font-headline font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
