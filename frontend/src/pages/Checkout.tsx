import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, Mail, Phone, Home, Shield, Banknote, Landmark, Truck as CodIcon } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { cn } from '@/lib/utils';
import qrImage from '@/assets/qr.jpg'; // Import the QR code image

const Checkout = () => {
  const { state, dispatch } = useBooks();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'UPI',
  });

  const subtotal = state.cart.reduce((sum, item) => 
    sum + (parseFloat(item.book.price) * item.quantity), 0
  );
  const gst = subtotal * 0.05;
  const shippingCost = subtotal > 500 ? 0 : 50;
  const total = subtotal + gst + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Order Confirmed!",
      description: "Thank you for your purchase. A confirmation has been sent to your email.",
      variant: "default",
    });
    navigate('/');
  };

  const paymentMethods = [
    { id: 'UPI', name: 'UPI / QR Code', icon: Banknote },
    { id: 'Card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'NetBanking', name: 'Net Banking', icon: Landmark },
    { id: 'COD', name: 'Cash on Delivery', icon: CodIcon },
  ];

  const getButtonText = () => {
    switch (formData.paymentMethod) {
      case 'UPI':
      case 'Card':
      case 'NetBanking':
        return `Pay ₹${total.toFixed(2)}`;
      case 'COD':
        return 'Place Order';
      default:
        return 'Confirm Order';
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-white/90 font-medium text-lg">
            Please provide your details to complete the order
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Details & Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" onChange={e => handleInputChange('name', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" onChange={e => handleInputChange('email', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 12345 67890" onChange={e => handleInputChange('phone', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123, Bookworm Lane" onChange={e => handleInputChange('address', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New Delhi" onChange={e => handleInputChange('city', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input id="pincode" placeholder="110001" onChange={e => handleInputChange('pincode', e.target.value)} />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map(method => (
                    <motion.div key={method.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={() => handleInputChange('paymentMethod', method.id)}
                        className={cn(
                          "w-full p-4 border rounded-lg flex flex-col items-center justify-center transition-all",
                          formData.paymentMethod === method.id 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-muted/50 hover:bg-muted"
                        )}
                      >
                        <method.icon className="h-6 w-6 mb-2" />
                        <span className="font-medium text-sm">{method.name}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & QR Code */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>GST (5%)</span><span>₹{gst.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>₹{shippingCost.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>
                <Button variant="hero" className="w-full h-12 text-lg shadow-glow" onClick={handleConfirmOrder}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  {getButtonText()}
                </Button>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-4">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </CardContent>
            </Card>
            
            <AnimatePresence>
              {formData.paymentMethod === 'UPI' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Scan to Pay</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <img src={qrImage} alt="QR Code for UPI Payment" className="rounded-lg w-48 h-48" />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

