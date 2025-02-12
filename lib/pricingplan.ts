export type PricingPlan = {
    level: string;
    price: string;
    features: string[];
};

export const pricingPlans: PricingPlan[] = [
    {
        level: "Starter",
        price: "Free",
        features: [
            "3 Trial Credits",
            "Standard Support",
            "Access to Essential Features",
            "Community Forum Access"
        ]
    },
    {
        level: "Professional",
        price: "$29/month",
        features: [
            "Unlimited Credits",
            "Priority Support",
            "Expanded Feature Set",
            "Community Forum Access"
        ]
    },
    {
        level: "Business",
        price: "$70/month",
        features: [
            "Unlimited Credits",
            "24/7 Premium Support",
            "All Features Unlocked",
            "Community Forum Access",
            "Exclusive Monthly Updates"
        ]
    }
];
