#!/usr/bin/env bun
/**
 * Script to update user credentials
 * Run with: bun run scripts/update-user-credentials.ts
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/core/utils/password-util'

const prisma = new PrismaClient()

const userId = 'cmgnok9tf0000j5ra45hzchsr'
const newEmail = 'wale@goremote.africa'
const newPassword = 'password000#P'

async function updateUserCredentials() {
  try {
    console.log('🔐 Updating user credentials...\n')

    // * Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.error(`❌ User with ID ${userId} not found`)
      return
    }

    console.log(`✅ Found user: ${user.email}`)

    // * Hash the new password using the project's utility
    console.log('🔒 Hashing new password...')
    const hashedPassword = await hashPassword(newPassword)

    // * Update user credentials
    console.log('📝 Updating credentials...')
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        did: true,
        didCreationStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log('✅ User credentials updated successfully!')
    console.log('\n📋 Updated User Details:')
    console.log(`   ID: ${updatedUser.id}`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   Name: ${updatedUser.name}`)
    console.log(`   Wallet: ${updatedUser.walletAddress || 'Not connected'}`)
    console.log(`   DID: ${updatedUser.did || 'Not created'}`)
    console.log(`   DID Status: ${updatedUser.didCreationStatus}`)
    console.log(`   Created: ${updatedUser.createdAt.toISOString()}`)
    console.log(`   Updated: ${updatedUser.updatedAt.toISOString()}`)

    console.log('\n🔑 New Login Credentials:')
    console.log(`   Email: ${newEmail}`)
    console.log(`   Password: ${newPassword}`)

  } catch (error) {
    console.error('❌ Error updating user credentials:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// * Run the script
updateUserCredentials()
