// Dependenceis
import * as express from 'express'
import * as bodyParser from 'body-parser'

// External
import { routerCaller } from './extras/routes'

export const app: express.Express = express();
const port = process.env.PORT || 3000;

/**
 * SERVER CONFIGS
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * SERVER IS RUNNING
 */
app.listen(port, () => {
    console.log('SERVER IS RUNNING AT PORT', port)
    routerCaller(app)
})

