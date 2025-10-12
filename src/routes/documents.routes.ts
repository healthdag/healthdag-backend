// * Document routes with OpenAPI documentation
import { OpenAPIHono } from '@hono/zod-openapi'
import { uploadDocument, getUserDocuments, getDocument } from '../features/documents/documents-controller'

const app = new OpenAPIHono()

// * POST /api/documents - Upload a document
app.post('/', uploadDocument)

// * GET /api/documents - Get user's documents
app.get('/', getUserDocuments)

// * GET /api/documents/:id - Get specific document
app.get('/:id', getDocument)

export default app
