-- AlterTable
CREATE SEQUENCE brand_id_seq;
ALTER TABLE "Brand" ALTER COLUMN "id" SET DEFAULT nextval('brand_id_seq');
ALTER SEQUENCE brand_id_seq OWNED BY "Brand"."id";

-- AlterTable
CREATE SEQUENCE cart_id_seq;
ALTER TABLE "Cart" ALTER COLUMN "id" SET DEFAULT nextval('cart_id_seq');
ALTER SEQUENCE cart_id_seq OWNED BY "Cart"."id";

-- AlterTable
CREATE SEQUENCE cartproduct_id_seq;
ALTER TABLE "CartProduct" ALTER COLUMN "id" SET DEFAULT nextval('cartproduct_id_seq');
ALTER SEQUENCE cartproduct_id_seq OWNED BY "CartProduct"."id";

-- AlterTable
CREATE SEQUENCE product_id_seq;
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT nextval('product_id_seq');
ALTER SEQUENCE product_id_seq OWNED BY "Product"."id";

-- AlterTable
CREATE SEQUENCE producttype_id_seq;
ALTER TABLE "ProductType" ALTER COLUMN "id" SET DEFAULT nextval('producttype_id_seq');
ALTER SEQUENCE producttype_id_seq OWNED BY "ProductType"."id";

-- AlterTable
CREATE SEQUENCE rating_id_seq;
ALTER TABLE "Rating" ALTER COLUMN "id" SET DEFAULT nextval('rating_id_seq');
ALTER SEQUENCE rating_id_seq OWNED BY "Rating"."id";

-- AlterTable
CREATE SEQUENCE refreshtoken_id_seq;
ALTER TABLE "RefreshToken" ALTER COLUMN "id" SET DEFAULT nextval('refreshtoken_id_seq');
ALTER SEQUENCE refreshtoken_id_seq OWNED BY "RefreshToken"."id";

-- AlterTable
CREATE SEQUENCE typebrand_id_seq;
ALTER TABLE "TypeBrand" ALTER COLUMN "id" SET DEFAULT nextval('typebrand_id_seq');
ALTER SEQUENCE typebrand_id_seq OWNED BY "TypeBrand"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";
