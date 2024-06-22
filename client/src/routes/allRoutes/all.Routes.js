import { adminRoutes } from "../admin/admin.Routes";
import { authRoutes } from "../auth/auth.Routes";
import { clientRoutes } from "../client/client.Routes";
import { errorRoutes } from "../error/error.Routes";
import { mainHotelRoutes } from "../hotel/mainHotel.Routes";
import { mailRoutes } from "../mail/mail.Routes";
import { vendorRoutes } from "../vendor/vendor.Routes";


export const allRoutes = [...authRoutes, ...errorRoutes,...mailRoutes,...adminRoutes,...vendorRoutes,...clientRoutes, ...mainHotelRoutes]