import StarshipDetailCard from "@/components/starships/StarshipDetailCard.component";
import { IStarship } from "@/interfaces/starships/IStarship.interface";
import { StarshipsService } from "@/services/starships/Startships.service";
import { Constants } from "@/utility/Constants";
import { Button, Grid } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "next-i18next";
import Helpers from "@/utility/Helpers";
import { useRouter } from "next/router";

function ShipDetailPage(props: IStarship.IStarshipDetail) {
  const router = useRouter();
  const isMdDown = Helpers.useMediaQuery("down", "md");
  const { t } = useTranslation("common");

  return (
    <Grid container justifyContent="center" mt={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="contained"
        data-cy="back-button"
        sx={{ position: "absolute", left: "3%", top: "5%" }}
        onClick={() => router.back()}
      >
        {isMdDown ? "" : t("Go-Back")}
      </Button>
      <StarshipDetailCard {...props} />
    </Grid>
  );
}
export default ShipDetailPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const detailId = context.params?.detailId;
    const result = await StarshipsService.GetDetail(detailId as string);

    // staticly added a starship image because there was none in api
    const defaultImageUrl = Constants.DefaultImage;
    result.data.imageUrl = defaultImageUrl;

    // getting i18n data before client side
    const i18nProps = await serverSideTranslations(context.locale ?? "tr", [
      "common",
    ]);

    return {
      props: {
        ...result.data,
        ...i18nProps,
      },
    };
  } catch (error: any) {
    console.log("Err:", error);
    context.res.writeHead(302, { Location: "/" });
    context.res.end();

    return { props: {} };
  }
};
