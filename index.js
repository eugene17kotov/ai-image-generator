import express from 'express';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const OPENAI_KEY = process.env.OPENAI_KEY;

const configuration = new Configuration({
    apiKey: OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    const { prompt, size = '512x512', number = 1 } = req.body;

    try {
        const response = await openai.createImage({
            prompt,
            size,
            n: Number(number),
        });

        res.render('index', {
            images: response.data.data,
        });
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response?.data?.error?.message);

        res.render('index', {
            error: error,
        });
    }
});

app.listen(3000, () => console.log('Server started...'));
