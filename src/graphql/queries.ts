import { gql } from "graphql-request";

export const HOME_DATA_QUERY = gql`
  query HomeData {
    homeData {
      introData {
        id
        img
        firstName
        lastName
        resume
        summary
      }
      serviceData {
        id
        iconLight
        iconDark
        title
        details
      }
      portfolioData {
        id
        featured
        title
        companyBuiltWith
        desc
        projectColor
        projectText
        outcome
        link
        moreInfoLink
        projectLogo
        image
        status
        skills
        carousel {
          id
          img
          desc
          title
          gridArea
        }
      }
      workExperienceData {
        id
        duration
        designation
        company
        location
        icon
        companyDescription
        whatIdid {
          title
          desc
        }
        skillsUsed
        achievement
        companySite
      }
      testimonialsData {
        id
        profile
        name
        designation
        description
      }
      educationData {
        id
        city
        duration
        academy
        degree
      }
      skillsData {
        id
        title
        level
        progress
      }
      contactData {
        id
        text
        iconLight
        iconDark
        link
      }
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: ContactMessageInput!) {
    sendMessage(input: $input) {
      success
      message
    }
  }
`;
