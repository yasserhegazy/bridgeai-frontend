"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Mail, Shield, Users } from "lucide-react";
import { invitationAPI, InvitationPublicDetails } from "@/lib/api-invitations";
import Link from "next/link";

function AcceptInviteClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<InvitationPublicDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status from cookies
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token' && value) {
          return true;
        }
      }
      // Fallback to localStorage
      return !!localStorage.getItem('token');
    };
    setIsAuthenticated(checkAuth());
  }, []);

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    fetchInvitationDetails();
  }, [token]);

  const fetchInvitationDetails = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const details = await invitationAPI.getInvitationDetails(token);
      setInvitation(details);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!token) return;

    try {
      setAccepting(true);
      const result = await invitationAPI.acceptInvitation(token);
      setSuccess(true);
      
      // Redirect to team page after 2 seconds
      setTimeout(() => {
        const teamId = result.team?.id || result.team_id || invitation?.team_id;
        if (teamId) {
          router.push(`/teams/${teamId}/dashboard`);
        } else {
          router.push('/teams');
        }
      }, 2000);
    } catch (err) {
      if (err instanceof Error && err.message === 'Authentication required') {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(`/invite/accept?token=${token}`);
        router.push(`/auth/login?redirect=${returnUrl}`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to accept invitation');
      }
    } finally {
      setAccepting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = invitation && new Date(invitation.expires_at) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#341BAB]"></div>
              <span className="ml-2 text-gray-600">Loading invitation...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Invalid Invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/teams">
              <Button className="w-full">Browse Teams</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the team!</h2>
            <p className="text-gray-600 mb-4">
              You've successfully joined <strong>{invitation?.team_name}</strong> as a <strong>{invitation?.role}</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to the team dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Team Invitation
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{invitation.team_name}</h3>
                <p className="text-sm text-gray-600">
                  Invited by: {invitation.invited_by_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Role: {invitation.role}</h4>
                <p className="text-sm text-gray-600">
                  {invitation.role === 'owner' && 'Full control over the team'}
                  {invitation.role === 'admin' && 'Can manage team settings and members'}
                  {invitation.role === 'member' && 'Can contribute to team projects'}
                  {invitation.role === 'viewer' && 'Can view team content'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-8 h-8 text-gray-600" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {isExpired ? 'Expired' : 'Expires'}
                </h4>
                <p className="text-sm text-gray-600">
                  {formatDate(invitation.expires_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Expired Warning */}
          {isExpired && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                This invitation has expired. Please contact the team admin for a new invitation.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isExpired && (
              <>
                {isAuthenticated ? (
                  <Button
                    onClick={handleAcceptInvitation}
                    disabled={accepting}
                    className="w-full bg-[#341BAB] hover:bg-[#271080]"
                  >
                    {accepting ? "Joining Team..." : "Accept Invitation"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-900 mb-2">
                        Authentication Required
                      </p>
                      <p className="text-sm text-yellow-800">
                        This invitation is for <strong>{invitation.email}</strong>.
                        Please log in or create an account with this email to accept.
                      </p>
                    </div>
                    
                    <Link href={`/auth/login?redirect=${encodeURIComponent(`/invite/accept?token=${token}`)}`}>
                      <Button className="w-full bg-[#341BAB] hover:bg-[#271080]">
                        <Mail className="w-4 h-4 mr-2" />
                        Log In with {invitation.email}
                      </Button>
                    </Link>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or</span>
                      </div>
                    </div>
                    
                    <Link href={`/auth/register?email=${encodeURIComponent(invitation.email)}&redirect=${encodeURIComponent(`/invite/accept?token=${token}`)}`}>
                      <Button variant="outline" className="w-full">
                        <Users className="w-4 h-4 mr-2" />
                        Create Account with {invitation.email}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
            
            <Link href="/teams">
              <Button variant="outline" className="w-full">
                Browse Teams
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#341BAB]"></div>
              <span className="ml-2 text-gray-600">Loading invitation...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AcceptInviteClientPage />
    </Suspense>
  );
}