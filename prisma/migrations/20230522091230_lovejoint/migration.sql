-- CreateEnum
CREATE TYPE "ReturnWarranty" AS ENUM ('NO_RETURN_NO_WARRANTY', 'NONE', 'NO_RETURN', 'NO_WARRANTY', 'RETURN_WARRANTY');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "policyType" "ReturnWarranty" DEFAULT 'NO_RETURN_NO_WARRANTY',
ALTER COLUMN "allergies" SET DEFAULT 'Please note that Love Joint does not offer any medical advice to its customers. We invite you to consult a doctor in order to have a professional opinion before using this product. Results may vary with each individual and we cannot guarantee its effects.  If you are already taking medication, have a specific health condition, are pregnant or have any other medical condition, please consult a healthcare practitioner before using this product.';
