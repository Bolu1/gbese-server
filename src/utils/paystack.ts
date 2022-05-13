/* eslint-disable prettier/prettier */
export const paystack = (request) => {
  try {
    const MySecretKey =
      "Bearer sk_test_530cc30f2989b68e407c5f8997ee137e23ab40ef";
    //replace the secret key with that from your paystack account
    const initializePayment = (form, mycallback) => {
      try {
        const options = {
          url: "https://api.paystack.co/transaction/initialize",
          headers: {
            authorization: MySecretKey,
            "content-type": "application/json",
            "cache-control": "no-cache",
          },
          form,
        };
        const callback = (error: any, response: any, body: any) => {
            try{
            return mycallback(error, body);
            }catch(error){
                console.log(error)
            }
        };
        request.post(options, callback);

      } catch (error) {
        console.log(error);
      }
    };

    const verifyPayment = (ref, mycallback) => {
      const options = {
        url:
          "https://api.paystack.co/transaction/verify/" +
          encodeURIComponent(ref),
        headers: {
          authorization: MySecretKey,
          "content-type": "application/json",
          "cache-control": "no-cache",
        },
      };
      const callback = (error, response, body) => {
        return mycallback(error, body);
      };
      request(options, callback);
    };

    return { initializePayment, verifyPayment };
  } catch (error) {
    console.log(error);
  }
};

module.exports = paystack;
