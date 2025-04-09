import { connectToMongoDB } from '../utils/mongodb';
import { defineNitroPlugin } from 'nitropack/runtime/plugin';

export default defineNitroPlugin(async () => {
    await connectToMongoDB();
}); 