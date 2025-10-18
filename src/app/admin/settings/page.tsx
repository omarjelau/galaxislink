'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";


export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDatabase = async () => {
    setIsResetting(true);
    try {
      const response = await fetch('/api/admin/reset-database', {
        method: 'POST',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset database.');
      }

      toast({
        title: "Database Reset Successful",
        description: "All user data has been cleared.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Platform Settings</h1>
        <p className="text-muted-foreground">Manage high-level platform data and configurations.</p>
      </header>
       <Card>
        <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
                Perform dangerous, high-level actions on your platform data. Use with extreme caution.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    The action below is irreversible and will permanently delete all user data, including authentication records and all Firestore documents. This is intended for development and testing purposes only.
                </AlertDescription>
            </Alert>

             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isResetting}>
                    {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset Entire Database
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all users, link pages, business cards, and all other data from your database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetDatabase} className="bg-destructive hover:bg-destructive/90">
                     I understand, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
