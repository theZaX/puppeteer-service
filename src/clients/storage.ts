import { Storage } from "@google-cloud/storage";

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

const serviceAccount = {
  type: "service_account",
  project_id: "mindsmith-8c753",
  private_key_id: "0683a6768bfe5e4435d26874e295ae22e7f37da2",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpO/M2/xDpAFkG\nVnUc+KKYZc1inZQTXK9e7QXfxjFnSXymYQd6Lc3NnDsTXPSZ4iwYaRGbj8N51SHR\nWL9cRVffUg3Dj0cRGgC6jK5k6sxMm0B7aGj9keaYXW9fkl5vMkrBJGsf5cTO+TJO\nlUytvh4qXJiX5Eeb3smr/snGSjU8MTvT4sJmn394K2NXwl0jbCIVM34FVICXbqSf\nhEnPyH2I61k4DnSqRcQuS0s/Ge7ZIm2XRiP8RudLToW32XIHzpS2PUKLCMvxEOli\nzbUcmKA+sdEpXmn1LinbHjM69kzYrnigBPum5gQPkaF4c2qRjdOPhKnLO1Md3R6m\nCecHcraTAgMBAAECggEAAyL3+wj3M0UCYWUGKVH3vC4G2dEPMYdXk2wpM7XkrIQR\nf16aWOAIdHXKJ9hiitzvnEmLk1Uyy6Cbo9mqkkyRYwjjoGruEkRnxw1cc2+2oaTZ\nqRqM95uAqUpHX39tqKScphUaty33BoRaiQJTYtT8kiRtNO4nivKyIjHyuMN0q8zm\nFSe8vFxmSkPzqmVM0m7Ha2lpRhm4eGIn29n2PAfu0Bmccxkn6/5AVUi33jJg1inN\nkmACL23Q/kGUR876DR8KUWCtpOSWj7T+Nozl7yR6Hu8r+rbh+DJ7JF8MU5ngkJW/\niQAvrSDq7bN23bnOE+GzdUiVFTF72DGjT4IHvkJ4IQKBgQDXx7GSeqkaPXwblfNK\n2ghLyAqzdW0Ku+oRdgSEXHVobKF1E2OT6qb8irCOGgSlX+cXhGzgKWzaaopcb/uf\npQiiCIHdeqY/PqMgRDOmqYMfMPYREuOsqpOJKpAeCn/d+7H+BtnkcQUh9V+L96Av\nLO2vB7jeyXvSkSvmEUYRmhm7jQKBgQDIxz3/AVxnwjiRcuwuKbhPzEger97E8Jop\nXEJaPyl0pZz0StPUtDPtZG/IVTl1wkzQjnDkZhnAJaIvu4SheC5SIkgbG7eHk5yX\nMi3D+S33e53pR51wxQeEjK+oKUEBl+6vITxe3zPE4yzoAoKfo55QlP64FgB6S3dv\n+sUdleiinwKBgHw7eL0A6gM1ixLGzoA177jRv3d7EACyGB1deVRLdz1b7cleFGLB\nIssbfnMR/8LG6GHd2GFm+Ej4NhjqUFClz8aaZ0qApt6azYhyO9qkld2LbuB9o59x\nxeefHcJuARhpJR1ADIs9ltrqTsxjEVKX53ByXbnG/wdIlaGsKE9SDaaxAoGBAJgg\n52elp1dzARusASqFMAM+nNKrnVaJm7WFEz2AKDAbIE61t8Wt+L6B4HThplUEsOFB\nXGaiuhYuLbKPGdKi1i4jjZEEsk4G2ZpySdz4nAyt3JuaSL/eenDDjIEVKQ1FCnQl\n8bFM29Pt8eOlq0W8WsNh8ZKYESqYrdnqH5roMEmvAoGAFnXQcLvPsqAkwHQGqFDq\n4kaph3QAdyb2zyvuh/zOecDJVbCD0MREhKGG/EpNdcj7KNuJN2+Hr2ApU7A2o5Wb\nfmx0PB3vBNLUr/eAcbYpiSt7HdGSpx6ARU3flKPzzJOX6uVNG5Wrbq/UX+0TlqCQ\nNcUmFtt/IEyZG5L65VF8aCg=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-71vp3@mindsmith-8c753.iam.gserviceaccount.com",
  client_id: "111182666553641747689",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-71vp3%40mindsmith-8c753.iam.gserviceaccount.com",
};

// Creates a client using Application Default Credentials
const storage = new Storage({
  credentials: serviceAccount,
});

export default storage;
