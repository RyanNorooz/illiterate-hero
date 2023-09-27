import CharacterBlastSection from '@/components/CharacterBlastSection'
import CustomHead from '@/components/Utils/CustomHead'
import { DEFAULT_LOCALE } from '@/configs'
import getInitialState from '@/store/getInitialState'
import { Stack } from '@mui/material'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function LandingPage() {
  return (
    <Stack>
      <CharacterBlastSection />
    </Stack>
  )
}

LandingPage.Layout = function Layout(page: React.ReactElement) {
  return (
    <>
      <CustomHead />
      {page}
    </>
  )
}

export const getServerSideProps = (async ({ locale, req }) => ({
  props: {
    locale,
    initialState: getInitialState(req.headers),
    ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
  },
})) satisfies GetServerSideProps
