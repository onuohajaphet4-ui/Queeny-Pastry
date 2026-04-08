import { favorite } from "../model/favorite.js"
import { product } from "../model/product.js"



// ➕ Add to Favorite
export const addToFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId } = req.body

    const products = await product.findById(productId)
    if (!products) {
      return res.status(404).json({ message: "Image not found" })
    }

    const favorites = await favorite.create({
      user: userId,
      product: productId
    })

    res.status(201).json({ message: "Added to favorites", favorite })

  } catch (error) {

    // duplicate error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already in favorites" })
    }

    res.status(500).json({ message: error.message })
  }
}




//  Get User Favorites
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id

    const favorites = await favorite.find({ user: userId })
      .populate("product")

    res.status(200).json(favorites)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}




// Remove from Favorite
export const removeFromFavorite = async (req, res) => {
 try {
            const id  = req.params.id
            const products = await favorite.findByIdAndDelete(id)
            if(!products) return res.status(400).json({message: 'Image not exist'}) 
            res.status(201).json({ success:true,
         message: 'product deleted successful'})
            await products.deleteOne ()
              
        } catch (error) {
            res.status(500).json({ success:false,message:"Sever Error", error})
        }
}