import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
  nullable,
} from "nexus";

export const Media = objectType({
  name: "Media",
  definition(t) {
    t.int("id");
    t.string("title");
    t.string("description");
    t.string("mediaType");
    t.string("url");
  },
});

// Create media
export const createMedia = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createMedia", {
      type: "Media",
      args: {
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        mediaType: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const { title, description, mediaType, url } = args;
        return await ctx.prisma.media.create({
          data: {
            title,
            description,
            mediaType,
            url,
          },
        });
      },
    });
  },
});

// get all media

export const getAllMedia = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("getAllMedia", {
      type: "Media",
      resolve: async (_, args, ctx) => {
        return ctx.prisma.media.findMany();
      },
    });
  },
});

// get media by id

export const getMediaById = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getMediaById", {
      type: "Media",
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, ctx) => {
        const { id } = args;
        return ctx.prisma.media.findUnique({
          where: {
            id,
          },
        });
      },
    });
  },
});

// update media

export const updateMedia = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateMedia", {
      type: "Media",
      args: {
        id: nonNull(intArg()),
        title: nullable(stringArg()),
        description: nullable(stringArg()),
        mediaType: nullable(stringArg()),
        url: nullable(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const { id, title, description, mediaType, url } = args;
        return ctx.prisma.media.update({
          where: {
            id,
          },
          data: {
            title,
            description,
            mediaType,
            url,
          },
        });
      },
    });
  },
});

// delete media

export const deleteMedia = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteMedia", {
      type: "Media",
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, ctx) => {
        const { id } = args;
        return ctx.prisma.media.delete({
          where: {
            id,
          },
        });
      },
    });
  },
});

// get media by mediaType

export const getMediaByMediaType = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("getMediaByMediaType", {
      type: "Media",
      args: {
        mediaType: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const { mediaType } = args;
        return ctx.prisma.media.findMany({
          where: {
            mediaType,
          },
        });
      },
    });
  },
});
