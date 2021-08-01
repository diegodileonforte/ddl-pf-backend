const Category = require('../models/categorySchema')

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    createCategory: async (req, res) => {
        try {
            // Admin = user con role 1
            // Solo el admin puede crear, borrar o actualizar una categoría
            const { name } = req.body;
            const category = await Category.findOne({ name })
            if (category) return res.status(400).json({ msg: `La categoría '${category}' ya existe` })

            const newCategory = new Category({ name })

            await newCategory.save()
            res.json({ msg: "Categoría creada." })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id)
            res.json({ msg: "Categoría eliminada." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    updateCategory: async (req, res) => {
        try {
            const {name} = req.body;
            await Category.findOneAndUpdate({_id: req.params.id}, {name})

            res.json({msg: "Categoría actualizada."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = categoryController