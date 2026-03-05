import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AnimatedBackground } from '@/components/AnimatedBackground'; // Corrected import
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Shop = () => {
  const { state, dispatch } = useBooks();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = state.cart.reduce((sum, item) => 
    sum + (parseFloat(item.book.price) * item.quantity), 0
  );
  
  const gst = subtotal * 0.05; // 5% GST
  const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
  const total = subtotal + gst + shippingCost - discount;

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: bookId });
      toast({
        title: "Item removed",
        description: "The book has been removed from your cart.",
        variant: "default",
      });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { bookId, quantity: newQuantity } });
    }
  };

  const handleRemoveFromCart = (bookId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: bookId });
    toast({
      title: "Item removed",
      description: "The book has been removed from your cart.",
      variant: "default",
    });
  };

  const handleApplyPromo = () => {
    const validCodes = {
      'BOOK10': 10,
      'READER20': 20,
      'SAVE50': 50,
      'STUDENT15': 15
    };

    const discountPercent = validCodes[promoCode.toUpperCase() as keyof typeof validCodes];
    
    if (discountPercent) {
      const discountAmount = (subtotal * discountPercent) / 100;
      setDiscount(discountAmount);
      toast({
        title: "Promo code applied!",
        description: `You saved ₹${discountAmount.toFixed(2)} with code ${promoCode.toUpperCase()}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (state.cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add some books to your cart first.",
        variant: "destructive",
      });
      return;
    }
    navigate('/checkout');
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-background relative">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ShoppingBag className="mx-auto h-24 w-24 text-white/50 mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-white">Your Cart is Empty</h2>
            <p className="text-white/90 font-medium mb-8 text-lg">
              Start shopping and discover amazing books in our collection
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate('/')}
                className="shadow-glow"
              >
                Continue Shopping
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      {/* Header */}
      <section className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-16 backdrop-blur-sm">
        <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
              <p className="text-white/90 font-medium text-lg">
                Review your items and proceed to checkout
              </p>
            </motion.div>
        </div>
      </section>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cart Items ({state.cart.length})</span>
                    <Badge variant="outline">{state.cart.reduce((sum, item) => sum + item.quantity, 0)} books</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AnimatePresence>
                    {state.cart.map((item, index) => (
                      <motion.div
                        key={item.book.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex gap-4 p-4 bg-muted/30 rounded-2xl hover:shadow-glow transition-smooth"
                      >
                        <img
                          src={item.book.cover}
                          alt={item.book.title}
                          className="w-20 h-28 object-cover rounded-lg shadow-sm"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-bold text-lg line-clamp-1">{item.book.title}</h3>
                            <p className="text-muted-foreground">by {item.book.author}</p>
                            <Badge variant="outline" className="mt-1">{item.book.genre}</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.book.id, item.quantity - 1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <span className="font-medium min-w-8 text-center">{item.quantity}</span>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.book.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-lg">₹{(parseFloat(item.book.price) * item.quantity).toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">₹{item.book.price} each</p>
                            </div>
                          </div>
                        </div>
                        
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFromCart(item.book.id)}
                            className="text-destructive hover:text-destructive self-start"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover:shadow-glow transition-smooth">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Have a promo code?</h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" onClick={handleApplyPromo}>
                        Apply
                      </Button>
                    </motion.div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Try: BOOK10, READER20, SAVE50, STUDENT15
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="sticky top-24 hover:shadow-glow transition-smooth">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span>₹{gst.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        Shipping
                        {shippingCost === 0 && <Badge variant="outline" className="text-green-600">Free</Badge>}
                      </span>
                      <span>₹{shippingCost.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="hero" className="w-full h-12 text-lg shadow-glow" onClick={handleCheckout}>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Order
                    </Button>
                  </motion.div>

                  {/* Security Features */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Secure checkout with SSL encryption</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Free shipping on orders above ₹500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

