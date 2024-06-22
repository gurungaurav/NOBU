const axios = require("axios");
require('dotenv').config()
    //!Ani success vayesi yeta bata update garni booking ko status and transaction table ma insert garni khalti bata aako data haru
    //! Ani yo pachi halka commission khani banauni payment garda hai ta

    //! Naya page banauni tesma chai reserve gareko bookings haru halni or unpaid bookings

    //Ani like steps for payment garchu hola ui ma 
const paymentConfirmation=(details) => async (req, res, next) => {
  try {

    console.log(details,'jjajaj');
    const final = {
      token: "dHwuuZoo7r8b7jcV7Tozb5",
      amount: 1000,
    };
    const test_secret_key = process.env.KHALTI_TEST_SECRET_KEY
    let config = {
      headers: {
        Authorization: `Key ${test_secret_key}`,
      },
    };
    const haha = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      details,
      config
    );

    console.log(haha,"second");
    return haha
    
  } catch (e) {
    next(e);
  }
};

module.exports = {paymentConfirmation}
