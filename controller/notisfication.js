import {notisfication} from "../model/notisfication.js"



export const createNotification = async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;

  try {
    const newNotification = await notisfication.create({
      user: userId, 
      message,
    });

    return res.status(201).json({
      message: "Notification created successfully",
      data: newNotification, 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

export const getAllNotification = async (req, res) => {
  try {
    const notifications = await notisfication.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

export const deleteNotification = async (req, res) => {
 try {
            const id  = req.params.id
            const notifications = await notisfication.findByIdAndDelete(id)
            if(!notifications) return res.status(400).json({message: 'Notification not exist'}) 
            res.status(201).json({ success:true,
         message: 'product deleted successful'})
            await notifications.deleteOne ()
              
        } catch (error) {
            res.status(500).json({ success:false,message:"Sever Error", error})
        }
}
