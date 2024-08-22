"use client";

import { truncateString } from "@/utils/functions";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { useEffect, useState } from "react";
import { ProductDetailType } from "@/utils/types";
import { useRouter } from "next/navigation";
import DeleteModal from "@/components/delete-modal/page";
import EditProductModal from "@/components/edit-product-modal/page";
import { supabase } from "@/lib/supabase";
import ErrorModal from "@/components/error-modal/page";
import { ThreeCircles } from "react-loader-spinner";

const ManageProducts = () => {
  const dropDownLinks = [
    {
      text: "Edit Product",
      link: () => setShowEditModal(true),
    },
    {
      text: "Delete Product",
      link: () => setShowDeleteModal(true),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
  const [products, setProducts] = useState<ProductDetailType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailType>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSelectProduct = (product: ProductDetailType) => {
    setSelectedProduct(product);
  };
  const router = useRouter();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").select();
      setProducts(data ?? []);
      if (error) {
        setShowErrorModal(true);
      }
    } catch (err: any) {
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct?.id);
      if (error) {
        setShowDeleteErrorModal(true);
      }
      setShowDeleteModal(false);
      fetchProducts();
    } catch {
      setShowDeleteErrorModal(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#dbd9d2] p-3 xs:p-4">
      <div className="mt-4 gap-1 flex justify-between text-sm items-center">
        <Link href="/home" className="flex gap-1">
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </Link>
        <button
          onClick={() => router.push("/new-product")}
          className="border border-[#3d3e3f]  p-2 text-xs md:text-sm"
        >
          Add product
        </button>
      </div>

      <h3 className="text-sm font-semibold text-center my-8">
        Manage Your Products
      </h3>
      {loading ? (
        <div className="grow w-full min-h-[85vh] md:min-h-[50vh] flex justify-center items-center p-3 xs:p-4">
          <ThreeCircles
            visible={true}
            height={50}
            width={50}
            color="#b4b4b4ad"
            ariaLabel="three-circles-loading"
            wrapperClass="my-4"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className=" text-sm w-full md:max-w-[85vw] ">
            {products?.map((item, index) => (
              <div
                key={item?.id}
                className={`relative flex gap-3 justify-between items-center ${
                  index === products?.length - 1
                    ? ""
                    : "border-b border-[#b9b9b96c]"
                }  py-2`}
              >
                <div className="">
                  <Image
                    src={item?.images[0]}
                    alt="product_image"
                    width="70"
                    height="70"
                    className={`${
                      item.sold_out ? "brightness-50" : ""
                    } h-[70px] object-cover`}
                  />
                </div>
                <p className="sm:hidden">
                  {truncateString(`${item?.name}`, 3)}{" "}
                </p>
                <p className="hidden sm:flex">
                  {truncateString(`${item?.name}`, 6)}{" "}
                </p>
                <div
                  className="cursor-pointer "
                  onClick={() => handleSelectProduct(item)}
                >
                  <CiMenuKebab size={20} />
                </div>
                {selectedProduct && selectedProduct === item && (
                  <div className="bg-[#ecebeb] rounded-sm p-2 absolute right-2 top-14 shadow-md text-xs sm:text-sm flex flex-col gap-2 z-[999]">
                    {dropDownLinks?.map((item, index) => (
                      <p
                        key={index}
                        className="hover:font-medium hover:bg-gray-50 p-1 cursor-pointer"
                        onClick={item?.link}
                      >
                        {item?.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedProduct={selectedProduct}
        onButtonClick={deleteProduct}
        loading={loading}
      />

      <EditProductModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedProduct={selectedProduct}
        refresh={fetchProducts}
      />
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          description="Sorry an error occured while loading the products"
        />
      )}
      {showDeleteErrorModal && (
        <ErrorModal
          show={showDeleteErrorModal}
          onClose={() => setShowDeleteErrorModal(false)}
          description="Sorry an error occured while deleting this product"
        />
      )}
    </div>
  );
};

export default ManageProducts;
