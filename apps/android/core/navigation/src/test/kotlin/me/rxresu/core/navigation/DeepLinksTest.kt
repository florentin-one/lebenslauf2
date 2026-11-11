package me.rxresu.core.navigation

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class DeepLinksTest {
    @Test fun builderLinkOpensBuilder() =
        assertEquals(Builder("abc123"), routeForLink("https://lebenslauf2.florentin-one.de/builder/abc123"))

    @Test fun publicResumeOnAppAndAliasHosts() {
        val a = "https://lebenslauf2.florentin-one.de/alex/fieldnote"
        val b = "https://cv2.florentin-one.de/alex"
        assertEquals(PublicResume(a), routeForLink(a))
        assertEquals(PublicResume(b), routeForLink(b))
    }

    @Test fun feedbackLinkOpensPublicViewer() {
        val link = "https://lebenslauf2.florentin-one.de/feedback/tok_1"
        assertEquals(PublicResume(link), routeForLink(link))
    }

    @Test fun appSectionsAndOtherHostsStayInTheBrowser() {
        assertNull(routeForLink("https://lebenslauf2.florentin-one.de/dashboard/resumes"))
        assertNull(routeForLink("https://lebenslauf2.florentin-one.de/auth/native-callback?code=x"))
        assertNull(routeForLink("https://lebenslauf2.florentin-one.de/"))
        assertNull(routeForLink("https://example.com/alex/cv"))
        assertNull(routeForLink("https://lebenslauf2.florentin-one.de/a/b/c"))
    }

    @Test fun sharedTextYieldsItsUrl() {
        assertEquals("https://lumen.jobs/roles/42", firstUrlIn("Senior designer at Lumen https://lumen.jobs/roles/42."))
        assertNull(firstUrlIn("no link here"))
    }
}
