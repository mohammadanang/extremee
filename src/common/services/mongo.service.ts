import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongo-service');

interface mongooseOptions {
  useNewUrlParser?: boolean,
  useUnifiedTopology?: boolean,
  serverSelectionTimeoutMS?: number,
  useFindAndModify?: boolean,
}

class MongoService {
  private count: number = 0;
  private DB_HOST_URL: any = process.env.DB_HOST_URL;
  private mongooseOptions: mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = () => {
    log('Attempting MongoDB connection (will retry if needed)');

    try {
      mongoose.connect(this.DB_HOST_URL, this.mongooseOptions);
      log('MongoDB is connected');
    } catch(err) {
      const retrySeconds: number = 5;
      log(`MongoDB connection failed (will retry ${++this.count} after ${retrySeconds} seconds):`, err);
      setTimeout(this.connectWithRetry, retrySeconds * 1000);
    }
  };
}

export default new MongoService();
