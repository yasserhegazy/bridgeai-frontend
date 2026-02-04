"use client";

import { memo } from "react";
import { Users, UserPlus, FolderDot, Sparkles, ShieldCheck, ClipboardCheck, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks";

interface EmptyTeamsProps {
    onCreateTeam: () => void;
}

export const EmptyTeams = memo(function EmptyTeams({
    onCreateTeam,
}: EmptyTeamsProps) {
    const { user } = useCurrentUser();
    const isBA = user?.role === "ba";

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-3xl p-12 text-center shadow-lg">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-xl shadow-primary/20">
                    {isBA ? (
                        <ShieldCheck className="w-10 h-10 text-white" />
                    ) : (
                        <Users className="w-10 h-10 text-white" />
                    )}
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {isBA 
                        ? "Establish Your Analyst Workspace" 
                        : "Welcome to BridgeAI Teams!"}
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    {isBA 
                        ? "Create an organizational unit to start reviewing client project requests. Teams help you partition different departments or client groups for efficient requirement validation."
                        : "Start collaborating with your organization by creating your first team. Teams allow you to manage projects, invite members, and streamline your CRS process."}
                </p>

                {/* CTA Button */}
                <Button
                    variant="primary"
                    size="lg"
                    onClick={onCreateTeam}
                    className="inline-flex items-center gap-3 px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer"
                >
                    <UserPlus className="w-6 h-6" />
                    <span>{isBA ? "Initialize Manager Team" : "Create Your First Team"}</span>
                </Button>

                {/* How It Works */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {isBA ? (
                        <>
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                                    <LayoutDashboard className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    1. Structure Workspace
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Define teams for specific client segments or internal departments to keep reviews organized.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                                    <ClipboardCheck className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    2. Review Requests
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Clients will submit project requests to these teams. Validate the scope before allowing CRS generation.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                                    <ShieldCheck className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    3. Finalize Documents
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Audit the generated CRS documents, add specialist comments, and provide final validation for dev teams.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                                    <UserPlus className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    1. Create a Team
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Start by naming your team. This will be the hub for all your team's projects and members.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    2. Invite Members
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Add your colleagues to your team. Collaborate together on gathering requirements.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                                    <FolderDot className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    3. Manage Projects
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Create projects within your team, use AI chats, and generate high-fidelity CRS documents.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Aesthetic Detail */}
                <div className="mt-8 flex items-center justify-center gap-2 text-primary/40">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {isBA ? "Ready to ensure quality requirements?" : "Ready to transform your requirements?"}
                    </span>
                    <Sparkles className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
});
