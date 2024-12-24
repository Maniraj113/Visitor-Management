import productCard from "./ProductCard.jsx"
function Products(){



    return (
        <div>
            {
            products.map(function(item){
                return (productCard(title =item.title, price ={item.price})
            })
        }
        
           
        </div>
        );
}

export default Products;

// map that can be used to iterate