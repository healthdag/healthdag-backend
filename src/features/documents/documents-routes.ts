// * Documents routes for HealthLease application
import { OpenAPIHono } from '@hono/zod-openapi'
import { uploadDocument, getUserDocuments, getDocument } from './documents-controller'

// * Create documents router
const documentsRouter = new OpenAPIHono()

// * POST /api/documents - Upload a document
documentsRouter.post('/', uploadDocument)

// * GET /api/documents - Get user's documents
documentsRouter.get('/', getUserDocuments)

// * GET /api/documents/:id - Get specific document
documentsRouter.get('/:id', getDocument)

export default documentsRouter
