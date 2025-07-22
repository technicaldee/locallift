import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getReferralTag as divviGetReferralTag, submitReferral as divviSubmitReferral } from '@divvi/referral-sdk';
import { DIVVI_CONSUMER_ADDRESS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDivviReferralTag(user: string) {
  return divviGetReferralTag({ user, consumer: DIVVI_CONSUMER_ADDRESS });
}

export async function submitDivviReferral(txHash: string, chainId: number) {
  return divviSubmitReferral({ txHash, chainId });
}