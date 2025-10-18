
'use client';

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { GalaxisLinkLogo } from "../GalaxisLinkLogo";
import { useLanguage } from "@/context/language-context";

export function InvitationPopup() {
    const { t } = useLanguage();
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="relative rounded-full h-14 w-14 shadow-lg overflow-hidden
                               before:absolute before:inset-0 before:bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#d946ef_25%,#f472b6_50%,#fb923c_75%,#a855f7_100%)] before:animate-spin-slow
                               after:absolute after:inset-[2px] after:bg-background after:rounded-full"
                >
                    <div className="relative z-10 flex items-center justify-center h-full w-full">
                         <HelpCircle className="h-8 w-8 text-primary" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                <div className="space-y-2 text-center">
                    <h4 className="font-medium leading-none">{t('onboardingHint')}</h4>
                    <p className="text-sm text-muted-foreground">
                     {t('onboardingLink')}
                    </p>
                </div>
                 <div className="grid gap-2">
                   <Button asChild>
                        <Link href="/signup">
                            {t('createProfile')}
                        </Link>
                   </Button>
                </div>
                 <div className="mt-2 text-center text-xs text-muted-foreground">
                    Powered by <GalaxisLinkLogo size="sm" />
                </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
