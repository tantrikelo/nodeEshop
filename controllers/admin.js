const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	// creatProduct is a sequalize magic method
	// that has been created from the db relations that
	//we have set between user and product on app.js file
	req.user
		.createProduct({
			title: title,
			price: price,
			imageUrl: imageUrl,
			description: description,
		})
		.then((result) => {
			// console.log(result);
			console.log("Created Product");
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	req.user
		//get products that are related with the current logged
		// in user
		.getProducts({ where: { id: prodId } })
		// Product.findByPk(prodId)
		.then((products) => {
			const product = products[0];
			if (!product) {
				return res.redirect("/");
			}
			res.render("admin/edit-product", {
				pageTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				product: product,
			});
		});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updateTitle = req.body.title;
	const updatePrice = req.body.price;
	const updateImageUrl = req.body.imageUrl;
	const updateDesc = req.body.description;

	Product.findByPk(prodId)
		.then((product) => {
			product.title = updateTitle;
			product.price = updatePrice;
			product.imageUrl = updateImageUrl;
			product.description = updateDesc;
			return product.save();
		})
		.then((result) => {
			console.log("UPDATED PRODUCT");
			res.redirect("/admin/products");
		})
		.catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
	req.user
		.getProducts()
		// Product.findAll()
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findByPk(prodId)
		.then((product) => {
			return product.destroy();
		})
		.then((result) => {
			res.redirect("/");
		})
		.catch((err) => console.log(err));
};
