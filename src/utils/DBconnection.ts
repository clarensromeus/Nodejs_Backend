import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config({ debug: true });

const { DB_USER_NAME, DB_PASSWORD } = process.env;

const DbConnection = async () => {
  connect(
    `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@adminapp.tlw6o07.mongodb.net/?retryWrites=true&w=majority`,
    {}
  );
};

/* mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
 */
