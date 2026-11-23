// ==============================================================================
// NelovMallickIITD CBT Platform - TermsAcceptanceModal (Retired / Non-Blocking)
// Consent is handled frictionlessly via one-line clickwrap notices on login & signup.
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React from 'react';

export interface TermsAcceptanceModalProps {
  isOpen?: boolean;
  userName?: string;
  onAccept?: (parentalConsent?: boolean) => Promise<void>;
  onSignOut?: () => void;
}

/**
 * Retired: Render null permanently so no blocking overlay ever appears.
 */
export const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = () => {
  return null;
};

export default TermsAcceptanceModal;
