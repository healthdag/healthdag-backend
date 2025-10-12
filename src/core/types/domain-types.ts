// * Domain types for HealthLease application
import type { Study, Lease, User, Document, AccessLog } from '@prisma/client'

// * Re-export Prisma types for convenience
export type { Study, Lease, User, Document, AccessLog }

// * Extended types with additional properties
export interface StudyWithLeases extends Study {
  leases: Pick<Lease, 'id' | 'status' | 'userId'>[]
}

export interface LeaseWithDetails extends Lease {
  user: Pick<User, 'id' | 'name' | 'email'>
  study: Pick<Study, 'id' | 'title' | 'description'>
}

// * API response types
export interface StudyListResponse {
  studies: Study[]
  total: number
  page: number
  limit: number
}

export interface LeaseStatusResponse {
  status: string
  leaseId: string
  studyId: string
  userId: string
}

// * Study application workflow types
export interface StudyApplicationRequest {
  userId: string
  studyId: string
}

export interface StudyApplicationResponse {
  leaseId: string
  status: string
  message: string
}

// * Marketplace filter types
export interface StudyFilters {
  status?: string
  researcherAddress?: string
  minPayment?: number
  maxPayment?: number
  participantsNeeded?: number
}

// * Study creation types (for future use)
export interface CreateStudyRequest {
  researcherAddress: string
  title: string
  description: string
  metadataHash: string
  irbApprovalHash: string
  paymentPerUser: number
  participantsNeeded: number
}

// * Lease management types
export interface LeaseUpdateRequest {
  status?: string
  startTime?: Date
  endTime?: Date
}

// * Study statistics types
export interface StudyStats {
  totalStudies: number
  activeStudies: number
  totalParticipants: number
  averagePayment: number
}

// * User study participation types
export interface UserStudyParticipation {
  userId: string
  activeLeases: number
  completedLeases: number
  totalEarnings: number
  studiesApplied: string[]
}
