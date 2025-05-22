
const DetailsController = {
    getDetails: async (req, res) => {
        try {
          const details = await Details.find({});
    
          res.json({
            message: "Data fetched successfully",
            details: { details },
          });
        } catch (error) {
          return res.status(500).json({ message: "Something went wrong", error });
        }
      },
}