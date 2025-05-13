import mongoose from 'mongoose';
import zipSchema from '../schemas/zipSchema.js';

const Zip = mongoose.model('Zip', zipSchema);

export default Zip;
