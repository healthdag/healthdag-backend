#!/usr/bin/env bun
/**
 * Script to create realistic mock lease data for testing
 * Run with: bun run scripts/create-mock-leases.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const userId = 'cmgnok9tf0000j5ra45hzchsr'

// * Realistic study data for mock leases
const mockStudies = [
  {
    onChainId: BigInt(1001),
    researcherAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    title: 'Cardiovascular Health Study',
    description: 'A comprehensive study examining cardiovascular health patterns in adults aged 25-65. We are collecting data on heart rate variability, blood pressure patterns, and lifestyle factors to better understand cardiovascular risk factors.',
    metadataHash: '0xabc123def456789',
    irbApprovalHash: '0xdef456abc123789',
    paymentPerUser: 150.00,
    participantsNeeded: 500,
    participantsEnrolled: 342,
    status: 'Active' as const
  },
  {
    onChainId: BigInt(1002),
    researcherAddress: '0x8a2d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
    title: 'Diabetes Management Research',
    description: 'Longitudinal study tracking diabetes management effectiveness across different treatment protocols. Participants will share glucose monitoring data, medication adherence records, and lifestyle tracking information.',
    metadataHash: '0xbcd234efg567890',
    irbApprovalHash: '0xefg567bcd234890',
    paymentPerUser: 200.00,
    participantsNeeded: 300,
    participantsEnrolled: 287,
    status: 'Active' as const
  },
  {
    onChainId: BigInt(1003),
    researcherAddress: '0x9b3d35Cc6634C0532925a3b844Bc9e7595f0bEb3',
    title: 'Mental Health & Sleep Patterns',
    description: 'Investigating the correlation between sleep quality, mental health indicators, and daily stress levels. This study aims to identify patterns that could improve mental health interventions.',
    metadataHash: '0xcde345fgh678901',
    irbApprovalHash: '0xfgh678cde345901',
    paymentPerUser: 125.00,
    participantsNeeded: 200,
    participantsEnrolled: 156,
    status: 'Active' as const
  },
  {
    onChainId: BigInt(1004),
    researcherAddress: '0xac4d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
    title: 'Cancer Treatment Side Effects',
    description: 'Monitoring and analyzing side effects of various cancer treatments to improve patient care protocols. Participants will share treatment records, symptom tracking, and quality of life assessments.',
    metadataHash: '0xdef456ghi789012',
    irbApprovalHash: '0xghi789def456012',
    paymentPerUser: 300.00,
    participantsNeeded: 150,
    participantsEnrolled: 98,
    status: 'Active' as const
  },
  {
    onChainId: BigInt(1005),
    researcherAddress: '0xbd5d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
    title: 'Pediatric Growth Patterns',
    description: 'Long-term study tracking growth patterns in children aged 5-18 to identify factors affecting healthy development. Parents will share growth measurements, nutrition data, and activity levels.',
    metadataHash: '0xefg567hij890123',
    irbApprovalHash: '0xhij890efg567123',
    paymentPerUser: 100.00,
    participantsNeeded: 1000,
    participantsEnrolled: 723,
    status: 'Active' as const
  }
]

// * Mock lease data with realistic statuses and timeframes
const mockLeases = [
  {
    onChainId: BigInt(2001),
    paymentAmount: 150.00,
    startTime: new Date('2024-01-15T00:00:00Z'),
    endTime: new Date('2024-07-15T00:00:00Z'),
    status: 'Active' as const,
    studyIndex: 0
  },
  {
    onChainId: BigInt(2002),
    paymentAmount: 200.00,
    startTime: new Date('2024-02-01T00:00:00Z'),
    endTime: new Date('2024-08-01T00:00:00Z'),
    status: 'Active' as const,
    studyIndex: 1
  },
  {
    onChainId: BigInt(2003),
    paymentAmount: 125.00,
    startTime: new Date('2023-11-01T00:00:00Z'),
    endTime: new Date('2024-05-01T00:00:00Z'),
    status: 'Completed' as const,
    studyIndex: 2
  },
  {
    onChainId: BigInt(2004),
    paymentAmount: 300.00,
    startTime: new Date('2024-03-10T00:00:00Z'),
    endTime: new Date('2024-09-10T00:00:00Z'),
    status: 'Active' as const,
    studyIndex: 3
  },
  {
    onChainId: BigInt(2005),
    paymentAmount: 100.00,
    startTime: new Date('2023-09-01T00:00:00Z'),
    endTime: new Date('2024-03-01T00:00:00Z'),
    status: 'Expired' as const,
    studyIndex: 4
  },
  {
    onChainId: BigInt(2006),
    paymentAmount: 150.00,
    startTime: new Date('2023-12-15T00:00:00Z'),
    endTime: new Date('2024-06-15T00:00:00Z'),
    status: 'Revoked' as const,
    studyIndex: 0
  }
]

async function createMockData() {
  try {
    console.log('🚀 Creating mock lease data...\n')

    // * Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.error(`❌ User with ID ${userId} not found`)
      console.log('Please ensure the user exists before creating mock data')
      return
    }

    console.log(`✅ Found user: ${user.email}`)

    // * Create studies first
    console.log('📊 Creating studies...')
    const createdStudies = []
    
    for (const studyData of mockStudies) {
      const study = await prisma.study.upsert({
        where: { onChainId: studyData.onChainId },
        update: studyData,
        create: studyData
      })
      createdStudies.push(study)
      console.log(`   ✅ Created/Updated study: ${study.title}`)
    }

    // * Create leases
    console.log('\n📋 Creating leases...')
    let createdLeases = 0

    for (const leaseData of mockLeases) {
      const study = createdStudies[leaseData.studyIndex]
      
      // * Remove studyIndex from the data before saving
      const { studyIndex, ...leaseDataWithoutIndex } = leaseData
      
      const lease = await prisma.lease.upsert({
        where: { onChainId: leaseData.onChainId },
        update: {
          ...leaseDataWithoutIndex,
          userId,
          studyId: study.id
        },
        create: {
          ...leaseDataWithoutIndex,
          userId,
          studyId: study.id
        }
      })
      
      createdLeases++
      console.log(`   ✅ Created/Updated lease: ${study.title} (${lease.status})`)
    }

    console.log(`\n🎉 Successfully created ${createdLeases} mock leases!`)
    console.log('\n📈 Summary:')
    console.log(`   - Studies: ${createdStudies.length}`)
    console.log(`   - Leases: ${createdLeases}`)
    console.log(`   - User: ${user.email}`)

    // * Show lease status breakdown
    const statusCounts = await prisma.lease.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true }
    })

    console.log('\n📊 Lease Status Breakdown:')
    statusCounts.forEach(count => {
      console.log(`   - ${count.status}: ${count._count.status}`)
    })

  } catch (error) {
    console.error('❌ Error creating mock data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// * Run the script
createMockData()
