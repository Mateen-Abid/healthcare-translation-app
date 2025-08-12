import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function translateText(text, targetLanguage = 'Urdu') {
  if (!text) return '';

  const prompt = `Translate the following text into ${targetLanguage}:\n\n"${text}"`;

  console.log('Calling OpenAI with prompt:', prompt);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful translator.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('OpenAI response:', response.data);

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI translation error:', error.response?.data || error.message);
    return 'Error in translation';
  }
}
