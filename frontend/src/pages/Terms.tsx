import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader>
              <Button variant="ghost" onClick={() => navigate(-1)} className="absolute top-4 left-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <CardTitle className="text-3xl font-bold text-center pt-12 text-gradient">
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none mx-auto p-8 space-y-4">
              <p>Welcome to Book Nest! These terms and conditions outline the rules and regulations for the use of our website.</p>
              
              <h3 className="font-semibold">1. Acceptance of Terms</h3>
              <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use Book Nest if you do not agree to all of the terms and conditions stated on this page.</p>
              
              <h3 className="font-semibold">2. Accounts and Membership</h3>
              <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
              
              <h3 className="font-semibold">3. User Content</h3>
              <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>

              <h3 className="font-semibold">4. Prohibited Uses</h3>
              <p>You may use our Service only for lawful purposes. You may not use our Service in any way that violates any applicable national or international law or regulation or to engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service.</p>
              
              <h3 className="font-semibold">5. Termination</h3>
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              
              <h3 className="font-semibold">6. Changes to Terms</h3>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
