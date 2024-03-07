import { StreamrClient } from 'streamr-client'

const initializeStreamr = async () => {
  try {
    const streamr = new StreamrClient({
      auth: {
        privateKey: "b24193be623d508049d583b221479bf07a4b7fbd09a0a0ce44af58c78383cd58",
      },
    });
    console.log(streamr)
    const stream = await streamr.createStream({
      id: '/ZkmlPool',
    });
    console.log(stream)

    return stream;
  } catch (error) {
    console.error('Error initializing Streamr:', error);
    throw error;
  }
};

export default initializeStreamr;
