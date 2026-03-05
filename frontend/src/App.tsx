import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"; // Import Outlet
import { BookProvider, useBooks } from "@/context/BookContext";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import BookReader from "./pages/BookReader";
import Community from "./pages/Community";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile"; 
import React from 'react';

const queryClient = new QueryClient();
const MainLayout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Renders the current matched route's component */}
  </>
);

// This component checks if a user is logged in.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useBooks();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// This component checks if a user is an admin.
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useBooks();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!state.user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BookProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            {/* All routes are now in this single top-level Routes block */}
            <Routes> 
              {/* --- 1. Public Routes without Navbar --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />

              {/* --- 2. Admin Route without Navbar (Needs Protection) --- */}
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <Admin />
                </ProtectedAdminRoute>
              } />

              {/* --- 3. Layout Route for all pages that include the Navbar --- */}
              <Route element={<MainLayout />}>
                {/* Public Route inside Layout */}
                <Route path="/" element={<Index />} />

                {/* All PROTECTED ROUTES inside Layout */}
                <Route path="/book/:bookId" element={
                  <ProtectedRoute><BookReader /></ProtectedRoute>
                } />
                <Route path="/library" element={
                  <ProtectedRoute><Library /></ProtectedRoute>
                } />
                <Route path="/community" element={
                  <ProtectedRoute><Community /></ProtectedRoute>
                } />
                <Route path="/shop" element={
                  <ProtectedRoute><Shop /></ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />

                {/* Note: The separate /admin route is no longer needed here. */}
              </Route>
              
              {/* --- 4. Catch-all for Not Found --- */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </div>
        </BrowserRouter>
      </BookProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;